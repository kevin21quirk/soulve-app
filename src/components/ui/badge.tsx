
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        soulve: 
          "border-transparent bg-gradient-to-r from-soulve-teal to-soulve-blue text-white hover:from-soulve-teal/90 hover:to-soulve-blue/90",
        "soulve-teal":
          "border-transparent bg-soulve-teal text-white hover:bg-soulve-teal/90",
        "soulve-blue":
          "border-transparent bg-soulve-blue text-white hover:bg-soulve-blue/90",
        "soulve-purple":
          "border-transparent bg-soulve-purple text-white hover:bg-soulve-purple/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
