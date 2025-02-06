import Button, { ButtonState } from "@/design-system/Button";
import { useMemo, type ReactElement } from "react";
import useDirty from "../hooks/useDirty";

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
  const { isDirty } = useDirty({ dirty });

  const primaryBtnStateParsed = useMemo(() => {
    if (primaryBtnState) return primaryBtnState;
    if (!isDirty) return "disabled";
  }, [primaryBtnState, isDirty]);

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
          />
        )}
      </div>
    </div>
  );
}
