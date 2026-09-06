import logo from "../assets/logo.png";

type HeaderProps = {
  screen: "form" | "loading" | "result";
};

export default function Header({ screen }: HeaderProps) {
  let logoClassName = "mx-auto w-full max-w-xs md:max-w-sm mix-blend-screen";

  if (screen === "form") {
    logoClassName += " mb-6";
  }

  return (
    <header className="max-w-3xl mx-auto px-6 pb-10 text-center">
      <h1>
        <img src={logo} alt="Roblox Face-Off" className={logoClassName} />
      </h1>

      {screen === "form" && (
        <p className="mt-4 text-slate-400 text-lg max-w-lg mx-auto">
          Compare two Roblox players side-by-side: friends, followers, groups,
          and more.
        </p>
      )}
    </header>
  );
}
