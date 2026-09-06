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

const avatarRings = {
  blue: "ring-blue-500/40",
  rose: "ring-rose-500/40",
};

type PlayerHeaderProps = {
  username: string;
  avatarUrl: string;
  yearOfCreation: string;
  gradientColor: keyof typeof gradients;
  side?: "left" | "right";
};

export default function PlayerHeader({
  username,
  avatarUrl,
  yearOfCreation,
  gradientColor,
  side = "right",
}: PlayerHeaderProps) {
  const sideClasses =
    side === "left" ? "md:flex-row-reverse text-left md:text-right" : "";

  return (
    <div
      className={`flex items-center gap-4 px-6 md:px-8 py-8 ${gradients[gradientColor][side]} ${sideClasses}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl bg-slate-800 shrink-0 overflow-hidden ring-2 ${avatarRings[gradientColor]}`}
      >
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={username}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div>
        <div className="font-display font-bold text-xl">{username}</div>
        <div className="text-xs text-slate-400 mt-0.5">{`Since ${yearOfCreation}`}</div>
      </div>
    </div>
  );
}
