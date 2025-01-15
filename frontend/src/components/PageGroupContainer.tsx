import type { ReactElement, ReactNode } from "react";

interface PageGroupContainerProperties {
  children: ReactNode;
  label: string;
  showLabel: boolean;
}

export default function PageGroupContainer({
  children,
  label,
  showLabel,
}: PageGroupContainerProperties): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {showLabel && (
        <span className="text-label-medium text-light-outline">{label}</span>
      )}
      {children}
    </div>
  );
}
