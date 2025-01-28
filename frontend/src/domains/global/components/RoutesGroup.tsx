import type { ReactElement } from "react";
import { Childrenable } from "../types/Components";

interface RoutesGroupProps extends Childrenable {
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
