import type { VercelRequest, VercelResponse } from "@vercel/node";

import type { PlayerStats } from "../src/types/player";

const USERS_API = "https://users.roblox.com/v1";
const FRIENDS_API = "https://friends.roblox.com/v1";
const GROUPS_API = "https://groups.roblox.com/v1";
const THUMBNAILS_API = "https://thumbnails.roblox.com/v1";

type ResolvedUser = {
  requestedUsername: string;
  id: number;
  name: string;
};

/**
 * Roblox answers a failed request with `{ errors: [...] }` and a non-2xx status.
 * Without this check the missing field would silently fall back to `0` further
 * down, showing wrong stats as if they were real.
 */
async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Roblox request failed (${response.status}): ${url}`);
  }

  return response.json();
}

async function resolveUsernames(usernames: string[]): Promise<ResolvedUser[]> {
  const { data } = (await fetchJson(`${USERS_API}/usernames/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames, excludeBannedUsers: true }),
  })) as { data: ResolvedUser[] };

  return data;
}

async function fetchPlayerStats(
  userId: number,
  username: string,
): Promise<PlayerStats> {
  const [user, friends, followers, following, groups, avatar] =
    await Promise.all([
      fetchJson(`${USERS_API}/users/${userId}`),
      fetchJson(`${FRIENDS_API}/users/${userId}/friends/count`),
      fetchJson(`${FRIENDS_API}/users/${userId}/followers/count`),
      fetchJson(`${FRIENDS_API}/users/${userId}/followings/count`),
      fetchJson(`${GROUPS_API}/users/${userId}/groups/roles`),
      fetchJson(
        `${THUMBNAILS_API}/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`,
      ),
    ]);

  const createdAt = new Date(user.created as string);
  if (Number.isNaN(createdAt.getTime())) {
    throw new Error(`Roblox returned an invalid creation date for ${username}.`);
  }

  return {
    id: userId,
    username,
    joinYear: createdAt.getFullYear(),
    avatarUrl: avatar.data?.[0]?.imageUrl ?? "",
    friendsCount: friends.count ?? 0,
    followersCount: followers.count ?? 0,
    followingCount: following.count ?? 0,
    groupsCount: groups.data?.length ?? 0,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username1, username2 } = req.query;

  if (typeof username1 !== "string" || typeof username2 !== "string") {
    res.status(400).json({ error: "username1 and username2 are required." });
    return;
  }

  const requestedA = username1.trim();
  const requestedB = username2.trim();

  if (!requestedA || !requestedB) {
    res.status(400).json({ error: "username1 and username2 are required." });
    return;
  }

  // Roblox de-duplicates the lookup below, so the same username twice would
  // resolve to a single user battling itself and tie on every stat.
  if (requestedA.toLowerCase() === requestedB.toLowerCase()) {
    res.status(400).json({ error: "Choose two different players." });
    return;
  }

  try {
    const resolved = await resolveUsernames([requestedA, requestedB]);

    const findUser = (username: string) =>
      resolved.find(
        (user) =>
          user.requestedUsername?.toLowerCase() === username.toLowerCase(),
      );

    const userA = findUser(requestedA);
    const userB = findUser(requestedB);

    // A username is missing when it does not exist or belongs to a banned
    // account, which `excludeBannedUsers` filters out of the response.
    if (!userA || !userB) {
      const notFound = [
        userA ? null : requestedA,
        userB ? null : requestedB,
      ].filter(Boolean);

      res.status(404).json({
        error: `Player${notFound.length > 1 ? "s" : ""} not found: ${notFound.join(", ")}.`,
      });
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
