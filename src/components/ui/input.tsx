import * as React from "react";
import { cn } from "@/components/ui/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-xl border border-white/12 bg-black/20 px-4 text-base text-foreground outline-none focus:border-amber",
        className,
      )}
      {...props}
    />
  );
}
