const gradients = {
  blue: {
    right: "bg-linear-to-r from-blue-950/60 to-transparent",
    left: "bg-linear-to-l from-blue-950/60 to-transparent",
  },
  rose: {
    right: "bg-linear-to-r from-rose-950/60 to-transparent",
    left: "bg-linear-to-l from-rose-950/60 to-transparent",
  },
};

export default function PlayerHeader({
  username,
  yearOfCreation,
  gradientColor,
  side = "right",
}) {
  const sideClasses =
    side === "left"
      ? "md:flex-row-reverse text-left md:text-right"
      : "";

  return (
    <div
      className={`flex items-center gap-4 px-8 py-7 ${gradients[gradientColor][side]} ${sideClasses}`}
    >
      <div className="w-14 h-14 rounded-xl bg-slate-800 flex-shrink-0"></div>
      <div>
        <div className="font-display font-bold text-xl">{username}</div>
        <div className="text-xs text-slate-400 mt-0.5">{`Since ${yearOfCreation}`}</div>
      </div>
    </div>
  );
}
