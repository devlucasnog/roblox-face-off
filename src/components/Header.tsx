import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="max-w-3xl mx-auto px-6 pb-10 text-center">
      <img
        src={logo}
        alt="Roblox Face-Off"
        className="mx-auto w-full max-w-xs md:max-w-sm mix-blend-screen"
      />

      <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight tracking-tight">
        Who wins this <span className="text-red-600">FACE-OFF</span>?
      </h1>
      <p className="mt-4 text-slate-400 text-lg max-w-md mx-auto">
        Compare two Roblox players side-by-side: friends, followers, groups, and
        more.
      </p>
    </header>
  );
}
