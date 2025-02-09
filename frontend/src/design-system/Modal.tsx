import { type ReactElement } from "react";
import {
  Dialog as DialogShadcn,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button, { ButtonState } from "./Button";
import { Childrenable, Dialog } from "@/domains/global/types/components";
import { DialogClose } from "@radix-ui/react-dialog";
import { DialogProvider } from "@/domains/global/contexts/DialogContext";
import useButtonState from "@/domains/global/hooks/useButtonState";

interface ContainerProps extends Dialog, Childrenable {}

function Container({ children, ...dialog }: ContainerProps): ReactElement {
  return (
    <DialogProvider {...dialog}>
      <DialogShadcn open={dialog.isOpen} onOpenChange={dialog.handleOpen}>
        <DialogContent className="bg-light-surfaceContainerLowest p-0 gap-0">
          {children}
        </DialogContent>
      </DialogShadcn>
    </DialogProvider>
  );
}

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps): ReactElement {
  return (
    <DialogHeader className="flex gap-2 flex-row items-center px-6 pt-6 pb-2">
      <DialogTitle className="flex-1">
        <span className="text-light-onSurface text-title-large">{title}</span>
      </DialogTitle>
      {/* DialogDescription corrige warning de acessibilidade */}
      <DialogDescription />
    </DialogHeader>
  );
}

function Body({ children }: Childrenable): ReactElement {
  return <div className="px-6 py-2">{children}</div>;
}

interface FooterProps {
  onClickPrimaryBtn?: () => void;
  labelPrimaryBtn: string;
  onClickSecondaryBtn?: () => void;
  labelSecondaryBtn?: string;
  primaryBtnState?: ButtonState;
  secondaryBtnState?: ButtonState;
  dirty?: boolean;
}

function Footer({
  onClickPrimaryBtn,
  labelPrimaryBtn,
  onClickSecondaryBtn,
  labelSecondaryBtn = "Cancelar",
  primaryBtnState,
  dirty,
  secondaryBtnState,
}: FooterProps): ReactElement {
  const primaryBtnStateParsed = useButtonState({
    dirty,
    buttonState: primaryBtnState,
  });

  return (
    <DialogFooter className="flex px-6 pb-6 pt-2">
      {onClickSecondaryBtn ? (
        <Button
          variant="secondary"
          onClick={onClickSecondaryBtn}
          label={labelSecondaryBtn}
          state={secondaryBtnState}
        />
      ) : (
        <DialogClose asChild>
          <Button
            variant="quaternary"
            label={labelSecondaryBtn}
            state={secondaryBtnState}
          />
        </DialogClose>
      )}
      <Button
        variant="primary"
        onClick={onClickPrimaryBtn}
        label={labelPrimaryBtn}
        state={primaryBtnStateParsed}
        type="submit"
      />
    </DialogFooter>
  );
}

const Modal = Object.assign(Container, { Header, Body, Footer });

export default Modal;
