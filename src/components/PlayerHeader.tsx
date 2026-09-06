import { AVATAR_BOX, PLAYER_ROW } from "../styles/classes";

const playerThemes = {
  sky: {
    right: "bg-linear-to-r from-sky-950/60 to-transparent",
    left: "bg-linear-to-l from-sky-950/60 to-transparent",
    ring: "ring-sky-500/40",
  },
  rose: {
    right: "bg-linear-to-r from-rose-950/60 to-transparent",
    left: "bg-linear-to-l from-rose-950/60 to-transparent",
    ring: "ring-rose-500/40",
  },
};

type PlayerHeaderProps = {
  username: string;
  avatarUrl: string;
  yearOfCreation: string;
  theme: keyof typeof playerThemes;
  side?: "left" | "right";
  isWinner?: boolean;
};

export default function PlayerHeader({
  username,
  avatarUrl,
  yearOfCreation,
  theme,
  side = "right",
  isWinner = false,
}: PlayerHeaderProps) {
  const sideClasses =
    side === "left" ? "md:flex-row-reverse text-left md:text-right" : "";

  return (
    <div
      className={`${PLAYER_ROW} ${playerThemes[theme][side]} ${sideClasses}`}
    >
      <div
        className={`${AVATAR_BOX} overflow-hidden ring-2 ${playerThemes[theme].ring} ${
          isWinner ? "bg-amber-400" : "bg-slate-800"
        }`}
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
        <div
          className={`font-display font-bold text-xl ${
            isWinner ? "text-amber-400" : ""
          }`}
        >
          {username}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{`Since ${yearOfCreation}`}</div>
      </div>
    </div>
  );
}
