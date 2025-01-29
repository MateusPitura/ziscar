import type { ReactElement } from "react";
import {
  Popover as PopoverShadcn,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import classNames from "classnames";
import { Childrenable } from "@/domains/global/types/components";

function Container({ children }: Childrenable): ReactElement {
  return <PopoverShadcn>{children}</PopoverShadcn>;
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
      className={classNames("bg-light-surface", className)}
      {...props}
    >
      {children}
    </PopoverContent>
  );
}

function Trigger({ children }: Childrenable): ReactElement {
  return <PopoverTrigger asChild>{children}</PopoverTrigger>;
}

const Popover = Object.assign(Container, { Content, Trigger });

export { Popover };
