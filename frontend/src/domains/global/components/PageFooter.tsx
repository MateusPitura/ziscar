import Icon from "@/design-system/Icon";
import { ButtonState } from "@/design-system/types";
import { Children, cloneElement, type ReactElement } from "react";
import { BLANK } from "../constants";
import useButtonState from "../hooks/useButtonState";
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
    <div className="w-full p-4 pb-0 flex justify-end gap-4">
      <span className="text-body-small text-red-500 flex items-center gap-1 flex-1">
        <Icon
          iconName="Emergency"
          fontSize="inherit"
          className="text-red-500 text-label-small"
        />
        {BLANK}
        Campos obrigatórios
      </span>
      {cloneElement(first as ReactElement, {
        state: primaryBtnStateParsed,
        type: "submit",
      })}
      {others}
    </div>
  );
}
