type InputProps = {
  label: string;
  name: string;
};

export default function Input({ label, name }: InputProps) {
  return (
    <div className="flex-1 text-left">
      <label htmlFor={name} className="block text-xs text-zinc-400 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        className="w-full bg-zinc-800 border border-zinc-700 focus:border-sky-500 focus:outline-none rounded-xl px-4 py-3.5 text-white placeholder-zinc-500"
        required
      />
    </div>
  );
}
