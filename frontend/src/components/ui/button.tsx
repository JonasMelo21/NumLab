import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "pill";
};

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium transition focus:outline-none";
  const variants = {
    default: "px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-slate-50",
    // Variante para "pills": não aplica bg/hover para não sobrescrever estado selecionado
    pill: "rounded-full px-6 py-3 border",
  } as const;

  const classes = `${base} ${variants[variant]} ${className}`.trim();
  return <button className={classes} {...props} />;
}
export default Button;
