import Button from "@/design-system/Button";
import { type ReactElement } from "react";
import useButtonState from "../hooks/useButtonState";
import { Action, Resource } from "@shared/types";
import { ButtonState, IconsName } from "@/design-system/types";

interface PageHeaderProperties {
  title: string;
  primaryButtonLabel?: string;
  onClickPrimaryBtn?: () => void;
  primaryBtnIconRigth?: IconsName;
  secondaryButtonLabel?: string;
  onClickSecondaryBtn?: () => void;
  primaryBtnState?: ButtonState;
  dirty?: boolean;
  primaryBtnResource?: Resource;
  primaryBtnAction?: Action;
}

export default function PageHeader({
  title,
  primaryButtonLabel,
  primaryBtnIconRigth,
  onClickPrimaryBtn,
  primaryBtnState,
  primaryBtnResource,
  primaryBtnAction,
  secondaryButtonLabel,
  onClickSecondaryBtn,
  dirty,
}: PageHeaderProperties): ReactElement {
  const primaryBtnStateParsed = useButtonState({
    dirty,
    buttonState: primaryBtnState,
  });

  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="flex-1 flex flex-col items-center gap-2">
        <span className="text-headline-large text-neutral-700 flex-1">
          {title}
        </span>
        <div className="border-b border-neutral-300 w-[80%]" />
      </div>
      <div className="flex justify-end">
        {secondaryButtonLabel && (
          <Button
            variant="quaternary"
            onClick={onClickSecondaryBtn}
            label={secondaryButtonLabel}
          />
        )}
        {primaryButtonLabel && (
          <Button
            variant="primary"
            onClick={onClickPrimaryBtn}
            label={primaryButtonLabel}
            iconRight={primaryBtnIconRigth}
            type="submit"
            state={primaryBtnStateParsed}
            resource={primaryBtnResource}
            action={primaryBtnAction}
          />
        )}
      </div>
    </div>
  );
}
