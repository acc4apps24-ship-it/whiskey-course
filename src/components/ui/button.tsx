import * as React from "react";
import { cn } from "@/components/ui/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-copper text-[#1b0f08] hover:bg-amber",
    ghost: "bg-white/8 text-foreground hover:bg-white/12",
    danger: "bg-red-950/70 text-red-100 hover:bg-red-900/80",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-xl px-4 py-3 text-base font-bold leading-snug transition focus:outline-none focus:ring-2 focus:ring-amber disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
