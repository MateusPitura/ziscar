import { useState, type ReactNode } from "react";

import Input from "./Input";
import { FieldValues } from "react-hook-form";
import Icon from "../Icon";

interface InputPasswordProperties<T> {
  name: keyof T & string;
  label: string;
  required?: boolean;
  autoFocus?: boolean;
}

export default function InputPassword<T extends FieldValues>({
  label,
  required,
  name,
  autoFocus = false,
}: InputPasswordProperties<T>): ReactNode {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input<T>
      name={name}
      label={label}
      required={required}
      iconRight={
        showPassword ? (
          <Icon iconName="Visibility" />
        ) : (
          <Icon iconName="VisibilityOff" />
        )
      }
      onClickIconRight={() => setShowPassword((prevState) => !prevState)}
      type={showPassword ? "text" : "password"}
      autoFocus={autoFocus}
    />
  );
}
