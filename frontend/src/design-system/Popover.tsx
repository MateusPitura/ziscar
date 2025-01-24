import type { ReactElement, ReactNode } from "react";
import {
  Popover as PopoverShadcn,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps): ReactElement {
  return <PopoverShadcn>{children}</PopoverShadcn>;
}

interface ContentProps {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
}

function Content({ children, ...props }: ContentProps): ReactElement {
  return (
    <PopoverContent className="bg-light-surface" {...props}>
      {children}
    </PopoverContent>
  );
}

interface TriggerProps {
  children: ReactNode;
}

function Trigger({ children }: TriggerProps): ReactElement {
  return <PopoverTrigger asChild>{children}</PopoverTrigger>;
}

const Popover = Object.assign(Container, { Content, Trigger });

export { Popover };
