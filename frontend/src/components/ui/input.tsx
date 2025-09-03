import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={("w-full border rounded-lg px-3 py-2 " + className).trim()} {...props} />;
}
export default Input;
