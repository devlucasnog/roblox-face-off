export default function FinalScore({ winner, score }) {
  return (
    <div className="bg-slate-800 rounded-b-2xl p-9 text-center">
      <div className="text-xs text-slate-400 tracking-wide">FINAL SCORE</div>
      <div className="font-display font-extrabold text-4xl md:text-5xl mt-2">
        <span className="text-blue-500">{score.playerA}</span>
        <span className="mx-3">×</span>
        <span className="text-rose-500">{score.playerB}</span>
      </div>

      <span className="inline-block mt-3.5 bg-amber-400/10 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full">
        {`${winner} won this battle!`}
      </span>

      <p>
        <button
          type="button"
          className="mt-7 bg-red-600 hover:bg-red-700 transition-colors text-white font-display font-bold text-base px-10 py-3.5 rounded-xl"
        >
          New battle!
        </button>
      </p>
    </div>
  );
}
