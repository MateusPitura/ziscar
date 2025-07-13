import { Children, cloneElement, type ReactElement } from "react";
import useButtonState from "../hooks/useButtonState";
import { ButtonState } from "@/design-system/types";
import { Childrenable } from "../types";

interface PageFooterProperties extends Childrenable {
  dirty?: boolean;
  primaryBtnState?: ButtonState;
}

export default function PageFooter({
  primaryBtnState,
  dirty,
  children,
}: PageFooterProperties): ReactElement {
  const primaryBtnStateParsed = useButtonState({
    dirty,
    buttonState: primaryBtnState,
  });

  const [first, ...others] = Children.toArray(children);

  return (
    <div className="w-full py-4 flex justify-end gap-4">
      {cloneElement(first as ReactElement, {
        state: primaryBtnStateParsed,
        type: "submit",
      })}
      {others}
    </div>
  );
}
