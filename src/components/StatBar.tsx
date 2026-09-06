import { Fragment } from "react";

import { formatCompactNumber } from "../utils/formatNumber";

type StatBarProps = {
  label: string;
  valueA: number;
  valueB: number;
  showDivider: boolean;
};

export default function StatBar({
  label,
  valueA,
  valueB,
  showDivider,
}: StatBarProps) {
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

  return (
    <Fragment>
      <div
        className={`col-span-3 text-center text-xs text-slate-400 pt-5 pb-2.5 ${
          showDivider ? "border-t border-slate-800" : ""
        }`}
      >
        {label}
      </div>

      <div className="flex items-center justify-between gap-1 whitespace-nowrap pb-5 font-display font-bold text-base md:text-xl text-blue-500">
        <span className="w-4 text-center">{isAWinner && crownElement}</span>
        <span>{formatCompactNumber(valueA)}</span>
      </div>

      <div className="pb-5">
        <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
          <div
            className="bg-linear-to-r from-blue-600 to-blue-400"
            style={{ width: `${percentageA}%` }}
          ></div>
          <div
            className="bg-linear-to-r from-rose-400 to-rose-600"
            style={{ width: `${percentageB}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 whitespace-nowrap pb-5 font-display font-bold text-base md:text-xl text-rose-500">
        <span>{formatCompactNumber(valueB)}</span>
        <span className="w-4 text-center">{isBWinner && crownElement}</span>
      </div>
    </Fragment>
  );
}
