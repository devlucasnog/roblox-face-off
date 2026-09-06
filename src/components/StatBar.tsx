type StatBarProps = {
  label: string;
  valueA: number;
  valueB: number;
};

export default function StatBar({ label, valueA, valueB }: StatBarProps) {
  const total = valueA + valueB;
  const percentageA = total === 0 ? 50 : (valueA / total) * 100;
  const percentageB = 100 - percentageA;

  const crownElement = <span className="text-amber-400">♛</span>;

  return (
    <div className="py-5">
      <div className="text-center text-xs text-slate-400 mb-2.5">{label}</div>
      <div className="grid grid-cols-[50px_1fr_50px] md:grid-cols-[60px_1fr_60px] items-center gap-4">
        <div className="font-display font-bold text-base md:text-xl text-right text-blue-500">
          {valueA > valueB && crownElement} {valueA}
        </div>
        <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
          <div
            className="bg-blue-500"
            style={{ width: `${percentageA}%` }}
          ></div>
          <div
            className="bg-rose-500"
            style={{ width: `${percentageB}%` }}
          ></div>
        </div>
        <div className="font-display font-bold text-base md:text-xl text-left text-rose-500">
          {valueB} {valueB > valueA && crownElement}
        </div>
      </div>
    </div>
  );
}
