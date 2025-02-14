import Button from "@/design-system/Button";
import { type ReactElement } from "react";
import useButtonState from "../hooks/useButtonState";
import { Resource, Action } from "../types/model";
import { ButtonState } from "@/design-system/types";

interface PageHeaderProperties {
  title: string;
  primaryButtonLabel?: string;
  onClickPrimaryBtn?: () => void;
  primaryBtnIconRigth?: ReactElement;
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
    <div className="w-full p-4 flex">
      <span className="text-headline-large text-light-onSurface flex-1">
        {title}
      </span>
      <div className="flex">
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
