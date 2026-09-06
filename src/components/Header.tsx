import logo from "../assets/logo.png";

type HederProps = {
  screen: "form" | "loading" | "result";
};

export default function Header({ screen }: HederProps) {
  let logoClassName = "mx-auto w-full max-w-xs md:max-w-sm mix-blend-screen";

  if (screen === "form") {
    logoClassName += " mb-6";
  }

  return (
    <header className="max-w-3xl mx-auto px-6 pb-10 text-center">
      <img src={logo} alt="Roblox Face-Off" className={logoClassName} />

      {screen === "form" && (
        <>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl leading-tight tracking-tight">
            Who wins this FACE-OFF?
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-lg mx-auto">
            Compare two Roblox players side-by-side: friends, followers, groups,
            and more.
          </p>
        </>
      )}
    </header>
  );
}
