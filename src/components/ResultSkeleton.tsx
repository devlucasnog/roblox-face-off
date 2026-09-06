import { Fragment } from "react";

import {
  AVATAR_BOX,
  CARD_BODY,
  CARD_FOOTER,
  CARD_HEADER,
  CARD_SHELL,
  PLAYER_ROW,
  STATS_GRID,
  VS_BADGE,
} from "../styles/classes";

const STAT_PLACEHOLDERS = [0, 1, 2, 3];

function PlayerHeaderSkeleton({ reversed = false }: { reversed?: boolean }) {
  return (
    <div className={`${PLAYER_ROW} ${reversed ? "md:flex-row-reverse" : ""}`}>
      <div className={`${AVATAR_BOX} bg-slate-800`} />
      <div className="flex flex-col gap-2">
        <div className="h-5 w-28 rounded bg-slate-800" />
        <div className="h-3 w-16 rounded bg-slate-800/70" />
      </div>
    </div>
  );
}

export default function ResultSkeleton() {
  return (
    <div
      className={`${CARD_SHELL} animate-pulse`}
      role="status"
      aria-label="Loading battle results"
    >
      <div className={CARD_HEADER}>
        <PlayerHeaderSkeleton />
        <div className={`${VS_BADGE} text-slate-700`}>VS</div>
        <PlayerHeaderSkeleton reversed />
      </div>

      <div className={CARD_BODY}>
        <div className={STATS_GRID}>
          {STAT_PLACEHOLDERS.map((placeholder) => (
            <Fragment key={placeholder}>
              <div
                className={`col-span-3 text-center pt-5 pb-2.5 ${
                  placeholder > 0 ? "border-t border-slate-800" : ""
                }`}
              >
                <div className="h-3 w-20 rounded bg-slate-800 mx-auto" />
              </div>

              <div className="pb-5">
                <div className="h-5 w-10 rounded bg-slate-800" />
              </div>

              <div className="pb-5">
                <div className="h-2 rounded-full bg-slate-800" />
              </div>

              <div className="pb-5">
                <div className="h-5 w-10 rounded bg-slate-800" />
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      <div className={`${CARD_FOOTER} flex flex-col items-center gap-3.5`}>
        <div className="h-3 w-24 rounded bg-slate-700/60" />
        <div className="h-12 w-32 rounded bg-slate-700/60" />
        <div className="h-8 w-48 rounded-full bg-slate-700/60" />
        <div className="h-12 w-40 rounded-xl bg-slate-700/60 mt-3.5" />
      </div>
    </div>
  );
}
