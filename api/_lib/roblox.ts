import type { PlayerStats } from "../../src/types/player";

const USERS_API = "https://users.roblox.com/v1";
const FRIENDS_API = "https://friends.roblox.com/v1";
const GROUPS_API = "https://groups.roblox.com/v1";
const THUMBNAILS_API = "https://thumbnails.roblox.com/v1";

export type ResolvedUser = {
  requestedUsername: string;
  id: number;
  name: string;
};

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Roblox request failed (${response.status}): ${url}`);
  }

  return response.json();
}

export async function resolveUsernames(
  usernames: string[],
): Promise<ResolvedUser[]> {
  const { data } = (await fetchJson(`${USERS_API}/usernames/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames, excludeBannedUsers: true }),
  })) as { data: ResolvedUser[] };

  return data;
}

export async function fetchPlayerStats(
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
