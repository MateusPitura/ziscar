import type { ReactElement, ReactNode } from "react";

interface RoutesGroupProps {
  children: ReactNode;
  label?: string;
}

export default function RoutesGroup({
  children,
  label,
}: RoutesGroupProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-label-medium text-light-outline">{label}</span>
      )}
      {children}
    </div>
  );
}
