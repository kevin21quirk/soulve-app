
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
          "border-transparent bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90",
        "soulve-teal":
          "border-transparent bg-[#0ce4af] text-white hover:bg-[#0ce4af]/90",
        "soulve-blue":
          "border-transparent bg-[#18a5fe] text-white hover:bg-[#18a5fe]/90",
        "soulve-purple":
          "border-transparent bg-[#4c3dfb] text-white hover:bg-[#4c3dfb]/90",
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
