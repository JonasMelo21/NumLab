import type { ComponentProps, PropsWithChildren } from "react";

function cn(...cls: (string | undefined | false)[]) {
  return cls.filter(Boolean).join(" ");
}

export function Card({ className, children, ...props }: PropsWithChildren<ComponentProps<"div">>) {
  return (
    <div className={cn("rounded-2xl border bg-white shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
export function CardHeader({ className, children, ...props }: PropsWithChildren<ComponentProps<"div">>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}
export function CardTitle({ className, children, ...props }: PropsWithChildren<ComponentProps<"h3">>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}
export function CardContent({ className, children, ...props }: PropsWithChildren<ComponentProps<"div">>) {
  return (
    <div className={cn("px-6 pb-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
