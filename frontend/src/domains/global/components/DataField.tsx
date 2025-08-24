import type { ReactNode } from "react";

interface DataFieldProperties {
  label: string;
  value?: string;
}

export default function DataField({
  label,
  value,
}: DataFieldProperties): ReactNode {
  return (
    <div>
      <span className="text-body-medium text-neutral-700 p-1">{label}:</span>
      <div className="border-neutral-500 border-b-2 flex items-center gap-1 overflow-hidden min-h-10">
        <span className="text-body-large text-neutral-700 p-1 px-2 flex-1">
          {value}
        </span>
      </div>
    </div>
  );
}
