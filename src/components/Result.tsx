import FinalScore from "./FinalScore";
import PlayerHeader from "./PlayerHeader";
import StatBar from "./StatBar";
import { calculateBattleScore } from "../utils/battleScore";
import type { PlayerStats } from "../types/player";

const REVEAL_BASE = 0.15;
const REVEAL_STEP = 0.08;

type ResultProps = {
  playerA: PlayerStats;
  playerB: PlayerStats;
  onReset: () => void;
};

export default function Result({ playerA, playerB, onReset }: ResultProps) {
  const { stats, scoreA, scoreB, winner } = calculateBattleScore({
    playerA,
    playerB,
  });

  return (
    <div className="w-full max-w-3xl mx-auto shadow-2xl shadow-black/40 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center bg-slate-900 border border-slate-800 rounded-t-2xl overflow-hidden">
        <PlayerHeader
          gradientColor="sky"
          username={playerA.username}
          avatarUrl={playerA.avatarUrl}
          yearOfCreation={String(playerA.joinYear)}
          side="right"
          isWinner={winner === playerA.username}
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
          isWinner={winner === playerB.username}
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
              revealDelay={REVEAL_BASE + index * REVEAL_STEP}
            />
          ))}
        </div>
      </div>

      <FinalScore
        winner={winner}
        score={{ playerA: scoreA, playerB: scoreB }}
        onReset={onReset}
        revealDelay={REVEAL_BASE + stats.length * REVEAL_STEP}
      />
    </div>
  );
}
