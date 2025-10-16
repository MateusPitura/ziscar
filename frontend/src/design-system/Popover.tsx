import type { ReactElement } from "react";
import {
  Popover as PopoverShadcn,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import classNames from "classnames";
import { Childrenable } from "@/domains/global/types";

interface ContainerProps extends Childrenable {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Container({
  children,
  onOpenChange,
  open,
}: ContainerProps): ReactElement {
  return (
    <PopoverShadcn open={open} onOpenChange={onOpenChange}>
      {children}
    </PopoverShadcn>
  );
}

interface ContentProps extends Childrenable {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  className?: string;
}

function Content({
  children,
  className,
  ...props
}: ContentProps): ReactElement {
  return (
    <PopoverContent
      className={classNames("bg-white", className)}
      {...props}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      {children}
    </PopoverContent>
  );
}

interface TriggerProps extends Childrenable {
  asChild?: boolean;
}

function Trigger({ children, asChild }: TriggerProps): ReactElement {
  return <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>;
}

const Popover = Object.assign(Container, { Content, Trigger });

export { Popover };
