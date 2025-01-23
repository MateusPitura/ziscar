import Button from "@/design-system/Button";
import type { ReactElement } from "react";

interface PageHeaderProperties {
  title: string;
  primaryButtonLabel?: string;
  onClickPrimaryBtn?: () => void;
  primaryBtnIconRigth?: ReactElement;
  secondaryButtonLabel?: string;
  onClickSecondaryBtn?: () => void;
}

export default function PageHeader({
  title,
  primaryButtonLabel,
  primaryBtnIconRigth,
  onClickPrimaryBtn,
  secondaryButtonLabel,
  onClickSecondaryBtn,
}: PageHeaderProperties): ReactElement {
  return (
    <div className="w-full p-4 flex">
      <span className="text-headline-large text-light-onSurface flex-1">
        {title}
      </span>
      <div className="flex">
        {onClickSecondaryBtn && (
          <Button
            variant="quaternary"
            onClick={onClickSecondaryBtn}
            label={secondaryButtonLabel}
          />
        )}
        {onClickPrimaryBtn && (
          <Button
            variant="primary"
            onClick={onClickPrimaryBtn}
            label={primaryButtonLabel}
            iconRight={primaryBtnIconRigth}
          />
        )}
      </div>
    </div>
  );
}
