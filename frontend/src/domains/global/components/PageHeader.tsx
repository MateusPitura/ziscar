import { Children, cloneElement, type ReactElement } from "react";
import useButtonState from "../hooks/useButtonState";
import { ButtonState } from "@/design-system/types";
import { Childrenable } from "../types";

interface PageHeaderProperties extends Childrenable {
  title: string;
  dirty?: boolean;
  primaryBtnState?: ButtonState;
}

export default function PageHeader({
  title,
  primaryBtnState,
  dirty,
  children,
}: PageHeaderProperties): ReactElement {
  const primaryBtnStateParsed = useButtonState({
    dirty,
    buttonState: primaryBtnState,
  });

  const [first, ...others] = Children.toArray(children);

  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="flex-1 flex flex-col items-center gap-2">
        <span className="text-headline-large text-neutral-700 flex-1">
          {title}
        </span>
        <div className="border-b border-neutral-300 w-[80%]" />
      </div>
      <div className="flex justify-end">
        {first &&
          cloneElement(first as ReactElement, {
            dirty,
            state: primaryBtnStateParsed,
            type: "submit",
          })}
        {others}
      </div>
    </div>
  );
}
