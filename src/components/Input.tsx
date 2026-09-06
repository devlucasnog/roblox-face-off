type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
};

export default function Input({
  label,
  name,
  value,
  onChange,
  error,
  disabled = false,
  placeholder,
}: InputProps) {
  const inputClasses = `w-full bg-slate-800/80 border focus:outline-none focus:ring-2 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-700 focus:border-sky-500 focus:ring-sky-500/20"
  }`;

  return (
    <div className="flex-1 text-left">
      <label htmlFor={name} className="block text-xs text-slate-400 mb-2">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClasses}
      />
      <p id={`${name}-error`} className="mt-1.5 min-h-4 text-xs text-red-500">
        {error}
      </p>
    </div>
  );
}
