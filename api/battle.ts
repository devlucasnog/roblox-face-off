import type { VercelRequest, VercelResponse } from "@vercel/node";

import type { PlayerStats } from "../src/types/player";

const USERS_API = "https://users.roblox.com/v1";
const FRIENDS_API = "https://friends.roblox.com/v1";
const BADGES_API = "https://badges.roblox.com/v1";
const GROUPS_API = "https://groups.roblox.com/v1";
const THUMBNAILS_API = "https://thumbnails.roblox.com/v1";

type ResolvedUser = {
  requestedUsername: string;
  id: number;
  name: string;
};

async function resolveUsernames(usernames: string[]): Promise<ResolvedUser[]> {
  const response = await fetch(`${USERS_API}/usernames/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames, excludeBannedUsers: true }),
  });

  if (!response.ok) {
    throw new Error("Failed to resolve usernames.");
  }

  const { data } = (await response.json()) as { data: ResolvedUser[] };
  return data;
}

async function fetchPlayerStats(
  userId: number,
  username: string,
): Promise<PlayerStats> {
  const [userRes, friendsRes, followersRes, badgesRes, groupsRes, avatarRes] =
    await Promise.all([
      fetch(`${USERS_API}/users/${userId}`),
      fetch(`${FRIENDS_API}/users/${userId}/friends/count`),
      fetch(`${FRIENDS_API}/users/${userId}/followers/count`),
      fetch(`${BADGES_API}/users/${userId}/badges?limit=100&sortOrder=Desc`),
      fetch(`${GROUPS_API}/users/${userId}/groups/roles`),
      fetch(
        `${THUMBNAILS_API}/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`,
      ),
    ]);

  const [user, friends, followers, badges, groups, avatar] =
    await Promise.all([
      userRes.json(),
      friendsRes.json(),
      followersRes.json(),
      badgesRes.json(),
      groupsRes.json(),
      avatarRes.json(),
    ]);

  return {
    id: userId,
    username,
    joinYear: new Date(user.created as string).getFullYear(),
    avatarUrl: avatar.data?.[0]?.imageUrl ?? "",
    friendsCount: friends.count ?? 0,
    followersCount: followers.count ?? 0,
    // Roblox has no direct "total badges" endpoint; this counts the first
    // 100 badges returned, which is an approximation for very prolific accounts.
    badgesCount: badges.data?.length ?? 0,
    groupsCount: groups.data?.length ?? 0,
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { username1, username2 } = req.query;

  if (typeof username1 !== "string" || typeof username2 !== "string") {
    res.status(400).json({ error: "username1 and username2 are required." });
    return;
  }

  try {
    const resolved = await resolveUsernames([username1, username2]);

    const userA = resolved.find(
      (user) => user.requestedUsername.toLowerCase() === username1.toLowerCase(),
    );
    const userB = resolved.find(
      (user) => user.requestedUsername.toLowerCase() === username2.toLowerCase(),
    );

    if (!userA || !userB) {
      res
        .status(404)
        .json({ error: "One or both usernames were not found." });
      return;
    }

    const [playerA, playerB] = await Promise.all([
      fetchPlayerStats(userA.id, userA.name),
      fetchPlayerStats(userB.id, userB.name),
    ]);

    res.status(200).json({ playerA, playerB });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Failed to fetch player data from Roblox." });
  }
}
