import type { PlayerStats } from "../../src/types/player";

const USERS_API = "https://users.roblox.com/v1";
const FRIENDS_API = "https://friends.roblox.com/v1";
const GROUPS_API = "https://groups.roblox.com/v1";
const THUMBNAILS_API = "https://thumbnails.roblox.com/v1";

export type ResolvedUser = {
  requestedUsername: string;
  id: number;
  name: string;
  displayName: string;
  hasVerifiedBadge: boolean;
};

type UsernamesResponse = {
  data: ResolvedUser[];
};

type UserDetailsResponse = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  created: string;
  isBanned: boolean;
  hasVerifiedBadge: boolean;
};

type CountResponse = {
  count: number;
};

type GroupMembership = {
  group: { id: number; name: string; memberCount: number };
  role: { id: number; name: string; rank: number };
};

type GroupsResponse = {
  data: GroupMembership[];
};

type Thumbnail = {
  targetId: number;
  state: "Completed" | "Pending" | "Blocked" | "Error";
  imageUrl: string;
};

type ThumbnailsResponse = {
  data: Thumbnail[];
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Roblox request failed (${response.status}): ${url}`);
  }

  return (await response.json()) as T;
}

export async function resolveUsernames(
  usernames: string[],
): Promise<ResolvedUser[]> {
  const { data } = await fetchJson<UsernamesResponse>(
    `${USERS_API}/usernames/users`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames, excludeBannedUsers: true }),
    },
  );

  return data;
}

export async function fetchPlayerStats(
  userId: number,
  username: string,
): Promise<PlayerStats> {
  const [user, friends, followers, following, groups, avatar] =
    await Promise.all([
      fetchJson<UserDetailsResponse>(`${USERS_API}/users/${userId}`),
      fetchJson<CountResponse>(`${FRIENDS_API}/users/${userId}/friends/count`),
      fetchJson<CountResponse>(
        `${FRIENDS_API}/users/${userId}/followers/count`,
      ),
      fetchJson<CountResponse>(
        `${FRIENDS_API}/users/${userId}/followings/count`,
      ),
      fetchJson<GroupsResponse>(`${GROUPS_API}/users/${userId}/groups/roles`),
      fetchJson<ThumbnailsResponse>(
        `${THUMBNAILS_API}/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`,
      ),
    ]);

  const createdAt = new Date(user.created);
  if (Number.isNaN(createdAt.getTime())) {
    throw new Error(
      `Roblox returned an invalid creation date for ${username}.`,
    );
  }

  const headshot = avatar.data.find(
    (thumbnail) => thumbnail.targetId === userId,
  );

  return {
    id: userId,
    username,
    joinYear: createdAt.getFullYear(),
    avatarUrl: headshot?.state === "Completed" ? headshot.imageUrl : "",
    friendsCount: friends.count,
    followersCount: followers.count,
    followingCount: following.count,
    groupsCount: groups.data.length,
  };
}
