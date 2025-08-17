import { type ReactElement } from "react";
import {
  Dialog as DialogShadcn,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button from "./Button";
import { DialogClose } from "@radix-ui/react-dialog";
import { DialogProvider } from "@/domains/global/contexts/DialogContext";
import useButtonState from "@/domains/global/hooks/useButtonState";
import { Childrenable, DialogProps } from "@/domains/global/types";
import { ButtonColor, ButtonState } from "./types";
import classNames from "classnames";
import { ActionsType, ResourcesType } from "@shared/enums";

interface ContainerProps extends DialogProps, Childrenable {}

function Container({ children, ...dialog }: ContainerProps): ReactElement {
  return (
    <DialogProvider {...dialog}>
      <DialogShadcn open={dialog.isOpen} onOpenChange={dialog.handleOpen}>
        <DialogContent className="bg-neutral-100 p-0 gap-0 [&>button]:!ring-0 [&>button]!outline-none [&>button]:!ring-offset-0">
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
        <span className="text-neutral-700 text-title-large">{title}</span>
      </DialogTitle>
      {/* DialogDescription corrige warning de acessibilidade */}
      <DialogDescription className="hidden" />
    </DialogHeader>
  );
}

function Body({ children }: Childrenable): ReactElement {
  return <div className="px-6 py-2 text-neutral-700">{children}</div>;
}

interface FooterProps {
  onClickPrimaryBtn?: () => void;
  labelPrimaryBtn: string;
  primaryBtnState?: ButtonState;
  primaryBtnColor?: ButtonColor;
  primaryBtnResource?: ResourcesType;
  primaryBtnAction?: ActionsType;
  onClickSecondaryBtn?: () => void;
  labelSecondaryBtn?: string;
  secondaryBtnState?: ButtonState;
  dirty?: boolean;
  className?: string;
}

function Footer({
  onClickPrimaryBtn,
  labelPrimaryBtn,
  primaryBtnState,
  primaryBtnResource,
  primaryBtnAction,
  onClickSecondaryBtn,
  labelSecondaryBtn = "Cancelar",
  secondaryBtnState,
  primaryBtnColor,
  dirty,
  className,
}: FooterProps): ReactElement {
  const primaryBtnStateParsed = useButtonState({
    dirty,
    buttonState: primaryBtnState,
  });

  return (
    <DialogFooter className={classNames("flex px-6 pb-6 pt-2", className)}>
      {onClickSecondaryBtn ? (
        <Button
          variant="quaternary"
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
        resource={primaryBtnResource}
        action={primaryBtnAction}
        color={primaryBtnColor}
        data-cy={"dialog-footer-button-primary"}
      />
    </DialogFooter>
  );
}

const Dialog = Object.assign(Container, { Header, Body, Footer });

export default Dialog;
