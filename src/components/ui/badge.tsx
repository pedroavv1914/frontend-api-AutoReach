"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105 hover:shadow-md backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm hover:shadow-lg hover:from-primary/90 hover:to-primary/80",
        secondary:
          "border-transparent bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-md hover:from-secondary/90 hover:to-secondary/80",
        destructive:
          "border-transparent bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-sm hover:shadow-lg hover:from-destructive/90 hover:to-destructive/80",
        outline: "text-foreground border-input bg-white/80 dark:bg-slate-800/80 hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
        success:
          "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:shadow-lg hover:from-green-600 hover:to-green-700",
        warning:
          "border-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm hover:shadow-lg hover:from-yellow-600 hover:to-yellow-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };