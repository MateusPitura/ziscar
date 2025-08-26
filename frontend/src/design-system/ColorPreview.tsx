import type { ReactNode } from "react";

interface ColorPreviewProperties {
  color: string;
}

export default function ColorPreview({
  color,
}: ColorPreviewProperties): ReactNode {
  return (
    <div
      className="h-6 w-12 rounded-md border border-neutral-300"
      style={{ backgroundColor: color }}
    />
  );
}
