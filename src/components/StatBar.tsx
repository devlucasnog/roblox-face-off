import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";

import { formatCompactNumber } from "../utils/formatNumber";

type StatBarProps = {
  label: string;
  valueA: number;
  valueB: number;
  showDivider: boolean;
  /** Seconds to wait before this row reveals, so rows cascade one by one. */
  revealDelay?: number;
};

export default function StatBar({
  label,
  valueA,
  valueB,
  showDivider,
  revealDelay = 0,
}: StatBarProps) {
  const shouldReduceMotion = useReducedMotion();

  // With no data on either side the track stays empty, instead of two half
  // bars that would look like both players scored the same real value.
  const total = valueA + valueB;
  const percentageA = total === 0 ? 0 : (valueA / total) * 100;
  const percentageB = total === 0 ? 0 : 100 - percentageA;

  const isAWinner = valueA > valueB;
  const isBWinner = valueB > valueA;

  // The glyph alone is read as "queen chess piece" by screen readers, so it is
  // hidden and paired with text that says what it actually means.
  const crownElement = (
    <>
      <span className="text-amber-400" aria-hidden="true">
        ♛
      </span>
      <span className="sr-only">Winner:</span>
    </>
  );

  const revealTransition = {
    duration: shouldReduceMotion ? 0 : 0.3,
    delay: shouldReduceMotion ? 0 : revealDelay,
    ease: "easeOut" as const,
  };

  // The bars start filling just after their row has landed.
  const barTransition = {
    duration: shouldReduceMotion ? 0 : 0.7,
    delay: shouldReduceMotion ? 0 : revealDelay + 0.1,
    ease: "easeOut" as const,
  };

  const reveal = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: revealTransition,
  };

  return (
    <Fragment>
      <motion.div
        {...reveal}
        className={`col-span-3 text-center text-xs text-slate-400 pt-5 pb-2.5 ${
          showDivider ? "border-t border-slate-800" : ""
        }`}
      >
        {label}
      </motion.div>

      <motion.div
        {...reveal}
        className="flex items-center justify-between gap-1 whitespace-nowrap pb-5 font-display font-bold text-base md:text-xl text-blue-500"
      >
        <span className="w-4 text-center">{isAWinner && crownElement}</span>
        <span>{formatCompactNumber(valueA)}</span>
      </motion.div>

      <motion.div {...reveal} className="pb-5">
        {/* Each side grows from its own edge towards the middle, so the two
            players visibly push against each other. */}
        <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-600 to-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${percentageA}%` }}
            transition={barTransition}
          />
          <motion.div
            className="absolute inset-y-0 right-0 bg-linear-to-r from-rose-400 to-rose-600"
            initial={{ width: 0 }}
            animate={{ width: `${percentageB}%` }}
            transition={barTransition}
          />
        </div>
      </motion.div>

      <motion.div
        {...reveal}
        className="flex items-center justify-between gap-1 whitespace-nowrap pb-5 font-display font-bold text-base md:text-xl text-rose-500"
      >
        <span>{formatCompactNumber(valueB)}</span>
        <span className="w-4 text-center">{isBWinner && crownElement}</span>
      </motion.div>
    </Fragment>
  );
}
