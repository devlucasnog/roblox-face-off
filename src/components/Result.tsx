import FinalScore from "./FinalScore";
import PlayerHeader from "./PlayerHeader";
import StatBar from "./StatBar";

export default function Result() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center bg-slate-900 border border-slate-800 rounded-t-2xl overflow-hidden">
        <PlayerHeader
          gradientColor="blue"
          username="TEST"
          yearOfCreation="2004"
          side="right"
        />

        <div className="font-display font-extrabold text-amber-400 text-sm px-5 py-2 text-center">
          VS
        </div>

        <PlayerHeader
          gradientColor="rose"
          username="TEST"
          yearOfCreation="2004"
          side="left"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 border-t-0 px-6 md:px-8 divide-y divide-slate-800">
        <StatBar label="Friends" valueA={100} valueB={50} />
      </div>

      <FinalScore winner="test" score={{ playerA: 3, playerB: 1 }} />
    </div>
  );
}
