import Button from "@/design-system/Button";
import type { ReactElement } from "react";

interface PageHeaderProperties {
  title: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  onClickPrimary?: () => void;
  onClickSecondary?: () => void;
}

export default function PageHeader({
  title,
  primaryButtonLabel,
  onClickPrimary,
  secondaryButtonLabel,
  onClickSecondary,
}: PageHeaderProperties): ReactElement {
  return (
    <div className="w-full p-4 flex">
      <span className="text-headline-large text-light-onSurface flex-1">
        {title}
      </span>
      <div className="flex">
        {onClickSecondary && (
          <Button
            variant="quaternary"
            onClick={onClickSecondary}
            label={secondaryButtonLabel}
          />
        )}
        {onClickPrimary && (
          <Button
            variant="primary"
            onClick={onClickPrimary}
            label={primaryButtonLabel}
          />
        )}
      </div>
    </div>
  );
}
