import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise-500 focus:ring-offset-2",
        {
          "border-transparent bg-navy-900 text-white shadow hover:bg-navy-800": variant === "default",
          "border-transparent bg-turquoise-100 text-turquoise-900 hover:bg-turquoise-200": variant === "secondary",
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600": variant === "destructive",
          "text-navy-900 border-navy-200": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
