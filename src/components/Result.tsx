import FinalScore from "./FinalScore";
import PlayerHeader from "./PlayerHeader";
import StatBar from "./StatBar";
import { calculateBattleScore } from "../utils/battleScore";
import {
  CARD_BODY,
  CARD_HEADER,
  CARD_SHELL,
  STATS_GRID,
  VS_BADGE,
} from "../styles/classes";
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
    <div className={CARD_SHELL}>
      <div className={CARD_HEADER}>
        <PlayerHeader
          theme="sky"
          username={playerA.username}
          avatarUrl={playerA.avatarUrl}
          yearOfCreation={String(playerA.joinYear)}
          side="right"
          isWinner={winner?.id === playerA.id}
        />

        <div className={`${VS_BADGE} text-amber-400`}>VS</div>

        <PlayerHeader
          theme="rose"
          username={playerB.username}
          avatarUrl={playerB.avatarUrl}
          yearOfCreation={String(playerB.joinYear)}
          side="left"
          isWinner={winner?.id === playerB.id}
        />
      </div>

      <div className={CARD_BODY}>
        <div className={STATS_GRID}>
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
        winner={winner?.username ?? null}
        score={{ playerA: scoreA, playerB: scoreB }}
        onReset={onReset}
        revealDelay={REVEAL_BASE + stats.length * REVEAL_STEP}
      />
    </div>
  );
}
