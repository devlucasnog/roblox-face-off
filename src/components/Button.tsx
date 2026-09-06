import type { ButtonHTMLAttributes } from "react";

import { DISABLED } from "../styles/classes";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`bg-red-600 hover:bg-red-700 transition-colors text-white font-display font-bold text-base px-10 py-3.5 rounded-xl shadow-lg shadow-red-950/40 ${DISABLED} ${className}`}
      {...props}
    />
  );
}
