export type PlayerStats = {
  id: number;
  username: string;
  joinYear: number;
  avatarUrl: string;
  friendsCount: number;
  followersCount: number;
  badgesCount: number;
  groupsCount: number;
};

export type BattleResult = {
  playerA: PlayerStats;
  playerB: PlayerStats;
};
