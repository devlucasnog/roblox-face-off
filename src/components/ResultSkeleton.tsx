const STAT_PLACEHOLDERS = [0, 1, 2, 3];

function PlayerHeaderSkeleton({ reversed = false }: { reversed?: boolean }) {
  return (
    <div
      className={`flex items-center gap-4 px-6 md:px-8 py-8 ${
        reversed ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-800 shrink-0" />
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
      className="w-full max-w-3xl mx-auto shadow-2xl shadow-black/40 rounded-2xl animate-pulse"
      role="status"
      aria-label="Loading battle results"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center bg-slate-900 border border-slate-800 rounded-t-2xl overflow-hidden">
        <PlayerHeaderSkeleton />
        <div className="font-display font-extrabold text-slate-700 text-sm px-5 py-2 text-center">
          VS
        </div>
        <PlayerHeaderSkeleton reversed />
      </div>

      <div className="bg-slate-900 border border-slate-800 border-t-0 px-6 md:px-8">
        {STAT_PLACEHOLDERS.map((placeholder) => (
          <div
            key={placeholder}
            className={`py-5 ${placeholder > 0 ? "border-t border-slate-800" : ""}`}
          >
            <div className="h-3 w-20 rounded bg-slate-800 mx-auto mb-3.5" />
            <div className="flex items-center gap-4">
              <div className="h-5 w-10 rounded bg-slate-800 shrink-0" />
              <div className="h-2 flex-1 rounded-full bg-slate-800" />
              <div className="h-5 w-10 rounded bg-slate-800 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/80 border-t border-slate-700/60 rounded-b-2xl p-9 flex flex-col items-center gap-3.5">
        <div className="h-3 w-24 rounded bg-slate-700/60" />
        <div className="h-12 w-32 rounded bg-slate-700/60" />
        <div className="h-8 w-48 rounded-full bg-slate-700/60" />
        <div className="h-12 w-40 rounded-xl bg-slate-700/60 mt-3.5" />
      </div>
    </div>
  );
}
