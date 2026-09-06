import { motion, useReducedMotion } from "motion/react";

import Button from "./Button";

type FinalScoreProps = {
  winner: string | null;
  score: {
    playerA: number;
    playerB: number;
  };
  onReset: () => void;
  /** Seconds to wait before revealing, so it lands after the stat rows. */
  revealDelay?: number;
};

export default function FinalScore({
  winner,
  score,
  onReset,
  revealDelay = 0,
}: FinalScoreProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
        delay: shouldReduceMotion ? 0 : revealDelay,
        ease: "easeOut",
      }}
      className="bg-slate-800/80 border-t border-slate-700/60 rounded-b-2xl p-9 text-center"
    >
      <div className="text-xs text-slate-400 tracking-wide">FINAL SCORE</div>
      <div className="font-display font-extrabold text-4xl md:text-5xl mt-2">
        <span className="text-blue-500">{score.playerA}</span>
        <span className="mx-3">×</span>
        <span className="text-rose-500">{score.playerB}</span>
      </div>

      {/* The badge pops in once the score is already on screen. */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.4,
          delay: shouldReduceMotion ? 0 : revealDelay + 0.2,
          type: shouldReduceMotion ? "tween" : "spring",
          bounce: 0.5,
        }}
        className="inline-block mt-3.5 bg-amber-400/10 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full"
      >
        {winner ? `${winner} won this battle!` : "It's a tie!"}
      </motion.span>

      <p>
        <Button type="button" onClick={onReset} className="mt-7">
          New battle!
        </Button>
      </p>
    </motion.div>
  );
}
