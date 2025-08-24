import type { ReactElement } from "react";
import Icon from "../Icon";

interface InputLabelProperties {
  label: string;
  required?: boolean;
}

export default function InputLabel({
  label,
  required,
}: InputLabelProperties): ReactElement {
  return (
    <div className="flex items-center gap-1 p-1">
      <span className="text-body-medium text-neutral-700">{label}</span>
      {required && (
        <Icon
          iconName="Emergency"
          fontSize="inherit"
          className="text-red-500 text-label-small"
        />
      )}
    </div>
  );
}
