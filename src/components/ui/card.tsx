import * as React from "react";
import { cn } from "@/components/ui/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-white/10 bg-white/[0.07] p-5 shadow-glow",
        className,
      )}
      {...props}
    />
  );
}
