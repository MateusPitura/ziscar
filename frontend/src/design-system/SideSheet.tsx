import type { ReactElement, ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Button from "./Button";

interface ContainerProps {
  children: ReactNode;
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
    </Sheet>
  );
}

interface TriggerProps {
  children: ReactNode;
}

function Trigger({ children }: TriggerProps): ReactElement {
  return <SheetTrigger asChild>{children}</SheetTrigger>;
}

interface ContentProps {
  children: ReactNode;
}

function Content({ children }: ContentProps): ReactElement {
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

interface BodyProps {
  children: ReactNode;
}

function Body({ children }: BodyProps): ReactElement {
  return <div className="px-6 flex-1 overflow-y-auto">{children}</div>;
}

interface FooterProps {
  primaryLabel: string;
  secondaryLabel: string;
  onSecondaryCallback: () => void;
  onPrimaryCallback: () => void;
}

function Footer({
  primaryLabel,
  secondaryLabel,
  onPrimaryCallback,
  onSecondaryCallback,
}: FooterProps): ReactElement {
  return (
    <div className="p-6 border-t border-neutral-300 flex">
      <Button label={primaryLabel} onClick={onPrimaryCallback} />
      <Button
        label={secondaryLabel}
        variant="quaternary"
        onClick={onSecondaryCallback}
      />
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
