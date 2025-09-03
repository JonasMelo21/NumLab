import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({ className = "", ...p }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={("rounded-xl border border-gray-200 bg-white shadow-sm " + className).trim()} {...p} />;
}
export function CardHeader({ className = "", ...p }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={("px-4 pt-4 " + className).trim()} {...p} />;
}
export function CardTitle({ className = "", ...p }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return <h3 className={("text-lg font-semibold " + className).trim()} {...p} />;
}
export function CardContent({ className = "", ...p }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={("px-4 pb-4 " + className).trim()} {...p} />;
}
