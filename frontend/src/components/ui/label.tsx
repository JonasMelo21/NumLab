import type { LabelHTMLAttributes, PropsWithChildren } from "react";

export function Label({ className = "", ...p }: PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>) {
  return <label className={("block text-sm font-medium mb-1 " + className).trim()} {...p} />;
}
export default Label;
