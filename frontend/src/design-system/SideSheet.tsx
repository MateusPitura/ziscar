import type { ReactElement } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Button from "./Button";
import classNames from "classnames";
import { DialogDescription } from "@/components/ui/dialog";
import { Childrenable } from "@/domains/global/types/components";

interface ContainerProps extends Childrenable {
  open?: boolean;
  onOpenChange?: (state: boolean) => void;
}

function Container({
  children,
  onOpenChange,
  open,
}: ContainerProps): ReactElement {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
      {/* DialogDescription corrige warning de acessibilidade */}
      <DialogDescription />
    </Sheet>
  );
}

function Trigger({ children }: Childrenable): ReactElement {
  return <SheetTrigger asChild>{children}</SheetTrigger>;
}

function Content({ children }: Childrenable): ReactElement {
  return (
    <SheetContent className="bg-light-surfaceContainerLowest rounded-tl-md flex flex-col p-0 gap-0 justify-between">
      {children}
    </SheetContent>
  );
}

interface HeaderProps {
  label: string;
}

function Header({ label }: HeaderProps): ReactElement {
  return (
    <SheetHeader className="p-6">
      <SheetTitle>
        <span className="text-title-large text-light-onSurface">{label}</span>
      </SheetTitle>
    </SheetHeader>
  );
}

interface BodyProps extends Childrenable {
  className?: string;
}

function Body({ children, className }: BodyProps): ReactElement {
  return (
    <div className={classNames("px-6 flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
}

interface FooterProps {
  primaryLabel: string;
  secondaryLabel: string;
  onSecondaryCallback?: () => void;
  onPrimaryCallback?: () => void;
  className?: string;
}

function Footer({
  primaryLabel,
  secondaryLabel = 'Cancelar',
  onPrimaryCallback,
  onSecondaryCallback,
  className,
}: FooterProps): ReactElement {
  return (
    <div
      className={classNames(
        "p-6 border-t border-neutral-300 flex flex-0",
        className
      )}
    >
      <Button label={primaryLabel} onClick={onPrimaryCallback} type="submit" />
      {onSecondaryCallback ? (
        <Button
          label={secondaryLabel}
          variant="quaternary"
          onClick={onSecondaryCallback}
        />
      ) : (
        <SheetClose asChild>
          <Button label={secondaryLabel} variant="quaternary" />
        </SheetClose>
      )}
    </div>
  );
}

const SideSheet = Object.assign(Container, {
  Trigger,
  Content,
  Header,
  Body,
  Footer,
});

export default SideSheet;
