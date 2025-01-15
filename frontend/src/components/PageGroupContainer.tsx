import type { ReactElement, ReactNode } from "react";

interface PageGroupContainerProperties {
  children: ReactNode;
  label?: string;
}

export default function PageGroupContainer({
  children,
  label,
}: PageGroupContainerProperties): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-label-medium text-light-outline">{label}</span>
      )}
      {children}
    </div>
  );
}
