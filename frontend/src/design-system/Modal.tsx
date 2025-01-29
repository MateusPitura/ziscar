import type { ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button, { ButtonState } from "./Button";
import { Childrenable } from "@/domains/global/types/components";
import { DialogClose } from "@radix-ui/react-dialog";

interface ContainerProps extends Childrenable {
  open: boolean;
  onClose: () => void;
}

function Container({ open, onClose, children }: ContainerProps): ReactElement {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-light-surfaceContainerLowest p-0 gap-0">
        {children}
      </DialogContent>
    </Dialog>
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
}

function Footer({
  onClickPrimaryBtn,
  labelPrimaryBtn,
  onClickSecondaryBtn,
  labelSecondaryBtn = 'Cancelar',
  primaryBtnState,
}: FooterProps): ReactElement {
  return (
    <DialogFooter className="flex px-6 pb-6 pt-2">
      {onClickSecondaryBtn ? (
        <Button
          variant="secondary"
          onClick={onClickSecondaryBtn}
          label={labelSecondaryBtn}
        />
      ) : (
        <DialogClose asChild>
          <Button variant="secondary" label={labelSecondaryBtn} />
        </DialogClose>
      )}
      <Button
        variant="primary"
        onClick={onClickPrimaryBtn}
        label={labelPrimaryBtn}
        state={primaryBtnState}
        type="submit"
      />
    </DialogFooter>
  );
}

const Modal = Object.assign(Container, { Header, Body, Footer });

export default Modal;
