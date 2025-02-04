import { useMemo, type ReactElement } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Button, { ButtonState } from "./Button";
import classNames from "classnames";
import { DialogDescription } from "@/components/ui/dialog";
import { Childrenable, Dialog } from "@/domains/global/types/components";
import { DialogProvider } from "@/domains/global/contexts/DialogContext";
import useDirty from "@/domains/global/hooks/useDirty";

interface ContainerProps extends Dialog, Childrenable {}

function Container({
  children,
  ...dialog
}: ContainerProps): ReactElement {
  return (
    <DialogProvider {...dialog}>
      <Sheet open={dialog.isOpen} onOpenChange={dialog.handleOpen}>
        {children}
        {/* DialogDescription corrige warning de acessibilidade */}
        <DialogDescription />
      </Sheet>
    </DialogProvider>
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
  dirty?: boolean;
  primaryBtnState?: ButtonState;
  secondaryBtnState?: ButtonState;
}

function Footer({
  primaryLabel,
  secondaryLabel = "Cancelar",
  onPrimaryCallback,
  onSecondaryCallback,
  className,
  dirty,
  primaryBtnState,
  secondaryBtnState,
}: FooterProps): ReactElement {
  const { isDirty } = useDirty({ dirty });

  const primaryBtnStateParsed = useMemo(() => {
    if (primaryBtnState) return primaryBtnState;
    if (!isDirty) return "disabled";
  }, [primaryBtnState, isDirty]);

  return (
    <div
      className={classNames(
        "p-6 border-t border-neutral-300 flex flex-0",
        className
      )}
    >
      <Button
        label={primaryLabel}
        onClick={onPrimaryCallback}
        type="submit"
        state={primaryBtnStateParsed}
      />
      {onSecondaryCallback ? (
        <Button
          label={secondaryLabel}
          variant="quaternary"
          onClick={onSecondaryCallback}
          state={secondaryBtnState}
        />
      ) : (
        <SheetClose asChild>
          <Button
            label={secondaryLabel}
            variant="quaternary"
            state={secondaryBtnState}
          />
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
