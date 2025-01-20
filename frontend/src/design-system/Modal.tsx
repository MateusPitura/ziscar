import type { ComponentProps, ReactElement, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button from "./Button";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ open, onClose, children }: ModalProps): ReactElement {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-light-surfaceContainerLowest [&>button]:hidden p-0 gap-0">
        {children}
      </DialogContent>
    </Dialog>
  );
}

interface HeaderProps {
  onClose: () => void;
  title: string;
}

function Header({ onClose, title }: HeaderProps): ReactElement {
  return (
    <DialogHeader className="flex gap-2 flex-row items-center px-6 pt-6 pb-2">
      <DialogTitle className="flex-1">
        <span className="text-light-onSurface text-title-large">{title}</span>
      </DialogTitle>
      <DialogDescription />
      <Button
        variant="tertiary"
        onClick={onClose}
        iconLeft={<CloseIcon />}
        padding="none"
      />
    </DialogHeader>
  );
}

interface BodyProps {
  children: ReactNode;
}

function Body({ children }: BodyProps): ReactElement {
  return <div className="px-6 py-2">{children}</div>;
}

interface FooterProps {
  onClickPrimaryBtn?: () => void;
  labelPrimaryBtn: string;
  onClickSecondaryBtn?: () => void;
  labelSecondaryBtn: string;
  primaryBtnState: ComponentProps<typeof Button>["state"];
}

function Footer({
  onClickPrimaryBtn,
  labelPrimaryBtn,
  onClickSecondaryBtn,
  labelSecondaryBtn,
  primaryBtnState,
}: FooterProps): ReactElement {
  return (
    <DialogFooter className="flex px-6 pb-6 pt-2">
      <Button
        variant="secondary"
        onClick={onClickSecondaryBtn}
        label={labelSecondaryBtn}
      />
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

Object.assign(Modal, { Header, Body, Footer });

type ModalType = typeof Modal & {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
};

export default Modal as ModalType;
