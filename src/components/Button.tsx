import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`bg-red-600 hover:bg-red-700 transition-colors text-white font-display font-bold text-base px-10 py-3.5 rounded-xl shadow-lg shadow-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
