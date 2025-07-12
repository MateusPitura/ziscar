import Button from "@/design-system/Button";
import { type ReactElement } from "react";
import useButtonState from "../hooks/useButtonState";
import { Action, Resource } from "@shared/types";
import { ButtonColor, ButtonState, IconsName } from "@/design-system/types";

interface PageFooterProperties {
  dirty?: boolean;
  primaryButtonLabel?: string;
  primaryBtnIconRigth?: IconsName;
  primaryBtnState?: ButtonState;
  primaryBtnResource?: Resource;
  primaryBtnAction?: Action;
  primaryBtnColor?: ButtonColor;
  onClickPrimaryBtn?: () => void;
  secondaryButtonLabel?: string;
  onClickSecondaryBtn?: () => void;
}

export default function PageFooter({
  primaryButtonLabel,
  primaryBtnIconRigth,
  onClickPrimaryBtn,
  primaryBtnState,
  primaryBtnResource,
  primaryBtnAction,
  secondaryButtonLabel,
  onClickSecondaryBtn,
  dirty,
  primaryBtnColor,
}: PageFooterProperties): ReactElement {
  const primaryBtnStateParsed = useButtonState({
    dirty,
    buttonState: primaryBtnState,
  });

  return (
    <div className="w-full py-4 flex justify-end gap-4">
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
          color={primaryBtnColor}
        />
      )}
      {secondaryButtonLabel && (
        <Button
          variant="primary"
          onClick={onClickSecondaryBtn}
          label={secondaryButtonLabel}
        />
      )}
    </div>
  );
}
