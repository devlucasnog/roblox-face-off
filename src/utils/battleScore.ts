import type { BattleResult } from "../types/player";

export type BattleStat = {
  label: string;
  valueA: number;
  valueB: number;
};

export type BattleScore = {
  stats: BattleStat[];
  scoreA: number;
  scoreB: number;
  /** `null` when both players win the same number of stats. */
  winner: string | null;
};

/**
 * Decides the battle: each stat is a point for whoever has the higher value,
 * and ties on a stat award no point to either side.
 */
export function calculateBattleScore({
  playerA,
  playerB,
}: BattleResult): BattleScore {
  const stats: BattleStat[] = [
    {
      label: "Friends",
      valueA: playerA.friendsCount,
      valueB: playerB.friendsCount,
    },
    {
      label: "Followers",
      valueA: playerA.followersCount,
      valueB: playerB.followersCount,
    },
    {
      label: "Following",
      valueA: playerA.followingCount,
      valueB: playerB.followingCount,
    },
    {
      label: "Groups",
      valueA: playerA.groupsCount,
      valueB: playerB.groupsCount,
    },
  ];

  let scoreA = 0;
  let scoreB = 0;

  for (const stat of stats) {
    if (stat.valueA > stat.valueB) scoreA++;
    else if (stat.valueB > stat.valueA) scoreB++;
  }

  const winner =
    scoreA === scoreB
      ? null
      : scoreA > scoreB
        ? playerA.username
        : playerB.username;

  return { stats, scoreA, scoreB, winner };
}
