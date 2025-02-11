import Button, { ButtonState } from "@/design-system/Button";
import { type ReactElement } from "react";
import useButtonState from "../hooks/useButtonState";
import CheckPermission from "./CheckPermission";

interface PageHeaderProperties {
  title: string;
  primaryButtonLabel?: string;
  onClickPrimaryBtn?: () => void;
  primaryBtnIconRigth?: ReactElement;
  secondaryButtonLabel?: string;
  onClickSecondaryBtn?: () => void;
  primaryBtnState?: ButtonState;
  dirty?: boolean;
}

export default function PageHeader({
  title,
  primaryButtonLabel,
  primaryBtnIconRigth,
  onClickPrimaryBtn,
  secondaryButtonLabel,
  onClickSecondaryBtn,
  dirty,
  primaryBtnState,
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
          <CheckPermission resource="users" action="create">
            <Button
              variant="primary"
              onClick={onClickPrimaryBtn}
              label={primaryButtonLabel}
              iconRight={primaryBtnIconRigth}
              type="submit"
              state={primaryBtnStateParsed}
            />
          </CheckPermission>
        )}
      </div>
    </div>
  );
}
