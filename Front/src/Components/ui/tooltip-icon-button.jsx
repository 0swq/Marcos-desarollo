"use client";

import { forwardRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip.jsx";
import { cn } from "@/lib/utils";
//asd
export const TooltipIconButton = forwardRef(
  ({ children, tooltip, side = "bottom", className, ...rest }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={ref}
              className={cn(
                "flex size-6 items-center justify-center rounded-md p-1 transition-colors hover:bg-foreground/10 disabled:pointer-events-none disabled:opacity-50",
                className
              )}
              {...rest}
            >
              {children}
              <span className="sr-only">{tooltip}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side={side}>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

TooltipIconButton.displayName = "TooltipIconButton";