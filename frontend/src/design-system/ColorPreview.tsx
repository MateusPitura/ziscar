import classNames from "classnames";
import type { ReactNode } from "react";

interface ColorPreviewProperties {
  color: string;
  className?: string;
}

export default function ColorPreview({
  color,
  className,
}: ColorPreviewProperties): ReactNode {
  return (
    <div
      className={classNames("h-6 w-12 rounded-md border border-neutral-300", className)}
      style={{ backgroundColor: `#${color}` }}
    />
  );
}
