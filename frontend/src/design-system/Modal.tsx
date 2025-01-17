import type { ReactElement, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import Button from "./Button";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProperties {
  open: boolean;
  onClose: () => void;
  title: string;
  labelPrimaryBtn: string;
  onClickPrimaryBtn?: () => void;
  labelSecondaryBtn: string;
  onClickSecondaryBtn?: () => void;
  isPrimaryBtnRed?: boolean;
  children: ReactNode;
  formId?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  labelPrimaryBtn,
  onClickPrimaryBtn,
  labelSecondaryBtn,
  onClickSecondaryBtn,
  isPrimaryBtnRed,
  children,
  formId,
}: ModalProperties): ReactElement {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-light-surfaceContainerLowest [&>button]:hidden">
        <DialogHeader className="flex gap-2 flex-row items-center">
          <DialogTitle className="flex-1">
            <span className="text-light-onSurface text-title-large">
              {title}
            </span>
          </DialogTitle>
          <DialogDescription />
          <Button
            variant="tertiary"
            onClick={onClose}
            iconLeft={<CloseIcon />}
            padding="none"
          />
        </DialogHeader>
        {children}
        <DialogFooter className="flex">
          <Button
            variant="secondary"
            onClick={onClickSecondaryBtn}
            label={labelSecondaryBtn}
          />
          <Button
            variant="primary"
            onClick={onClickPrimaryBtn}
            label={labelPrimaryBtn}
            state={isPrimaryBtnRed ? "red" : undefined}
            type="submit"
            form={formId}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
