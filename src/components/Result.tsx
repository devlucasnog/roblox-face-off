import FinalScore from "./FinalScore";
import PlayerHeader from "./PlayerHeader";
import StatBar from "./StatBar";
import type { PlayerStats } from "../types/player";

type ResultProps = {
  playerA: PlayerStats;
  playerB: PlayerStats;
  onReset: () => void;
};

export default function Result({ playerA, playerB, onReset }: ResultProps) {
  const stats = [
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

  return (
    <div className="w-full max-w-3xl mx-auto shadow-2xl shadow-black/40 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center bg-slate-900 border border-slate-800 rounded-t-2xl overflow-hidden">
        <PlayerHeader
          gradientColor="blue"
          username={playerA.username}
          avatarUrl={playerA.avatarUrl}
          yearOfCreation={String(playerA.joinYear)}
          side="right"
        />

        <div className="font-display font-extrabold text-amber-400 text-sm px-5 py-2 text-center">
          VS
        </div>

        <PlayerHeader
          gradientColor="rose"
          username={playerB.username}
          avatarUrl={playerB.avatarUrl}
          yearOfCreation={String(playerB.joinYear)}
          side="left"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 border-t-0 px-6 md:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4">
          {stats.map((stat, index) => (
            <StatBar
              key={stat.label}
              label={stat.label}
              valueA={stat.valueA}
              valueB={stat.valueB}
              showDivider={index > 0}
            />
          ))}
        </div>
      </div>

      <FinalScore
        winner={winner}
        score={{ playerA: scoreA, playerB: scoreB }}
        onReset={onReset}
      />
    </div>
  );
}
