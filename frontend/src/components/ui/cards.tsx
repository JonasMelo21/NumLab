import type { ComponentProps, PropsWithChildren } from "react";

/* util simples para concatenar classes */
function cn(...cls: (string | undefined | false)[]) {
  return cls.filter(Boolean).join(" ");
}

export function Card({ className, children, ...props }: PropsWithChildren<ComponentProps<"div">>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: PropsWithChildren<ComponentProps<"div">>) {
  return (
    <div className={cn("p-5", className)} {...props}>
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
    <div className={cn("p-5 pt-0 text-sm text-gray-600 leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}
