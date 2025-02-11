import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as TooltipShadcn,
} from "@/components/ui/tooltip";
import { Childrenable } from "@/domains/global/types/components";
import { TooltipArrow } from "@radix-ui/react-tooltip";

import type { ReactNode } from "react";

interface TooltipProperties extends Childrenable {
  content: string;
}

export default function Tooltip({
  children,
  content,
}: TooltipProperties): ReactNode {
  return (
    <TooltipProvider>
      <TooltipShadcn>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-light-outline border-light-outline text-light-onPrimary"
        >
          <TooltipArrow className="fill-light-outline" />
          <span className="text-label-medium">{content}</span>
        </TooltipContent>
      </TooltipShadcn>
    </TooltipProvider>
  );
}
