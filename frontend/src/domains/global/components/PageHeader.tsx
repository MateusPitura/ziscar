import Button from "@/design-system/Button";
import Dialog from "@/design-system/Dialog";
import { ButtonState } from "@/design-system/types";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import {
  Children,
  cloneElement, useEffect,
  type ReactElement
} from "react";
import useButtonState from "../hooks/useButtonState";
import useDialog from "../hooks/useDialog";
import { Childrenable } from "../types";

interface PageHeaderProperties extends Childrenable, ContextHelperable {
  title: string;
  dirty?: boolean;
  primaryBtnState?: ButtonState;
}

export default function PageHeader({
  title,
  primaryBtnState,
  dirty,
  children,
  contextHelper
}: PageHeaderProperties): ReactElement {
  const primaryBtnStateParsed = useButtonState({
    dirty,
    buttonState: primaryBtnState,
  });

  const contextHelperModal = useDialog();

  const [first, ...others] = Children.toArray(children);

  useEffect(() => {
    const handleKeyDown = (event: WindowEventMap["keydown"]) => {
      if (event.key === "F1") {
        event.preventDefault();
        contextHelperModal.openDialog();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Dialog {...contextHelperModal} maxWidth="max-w-[60rem] pb-4">
        <Dialog.Header title="Dúvidas" />
        <Dialog.Body>
          {contextHelper}
        </Dialog.Body>
      </Dialog>
      <div className="w-full flex flex-col gap-4">
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center w-full">
            <Button
              iconLeft="Help"
              variant="quaternary"
              className="text-neutral-700"
              onClick={contextHelperModal.openDialog}
            />
            <span className="text-headline-large flex-1 text-center text-neutral-700">
              {title}
            </span>
          </div>
          <div className="border-b border-neutral-300 w-[80%]" />
        </div>
        <div className="flex justify-end empty:hidden">
          {first &&
            cloneElement(first as ReactElement, {
              dirty,
              state: primaryBtnStateParsed,
              type: "submit",
            })}
          {others}
        </div>
      </div>
    </>
  );
}
