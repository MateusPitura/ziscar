import type { ReactElement } from "react";

interface InputLabelProperties {
  label: string;
  required?: boolean;
}

export default function InputLabel({
  label,
  required,
}: InputLabelProperties): ReactElement {
  return (
    <div>
      <span className="text-body-medium text-neutral-700 p-1">{label}</span>
      {required && <span className="text-red-500 text-body-medium">*</span>}
    </div>
  );
}
