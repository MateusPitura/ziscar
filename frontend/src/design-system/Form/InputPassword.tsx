import { useState, type ReactNode } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Input from "./Input";
import { FieldValues } from "react-hook-form";

interface InputPasswordProperties<T> {
  name: keyof T & string;
  label: string;
  required?: boolean;
}

export default function InputPassword<T extends FieldValues>({
  label,
  required,
  name,
}: InputPasswordProperties<T>): ReactNode {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input<T>
      name={name}
      label={label}
      required={required}
      iconRight={
        showPassword ? (
          <VisibilityOutlinedIcon />
        ) : (
          <VisibilityOffOutlinedIcon />
        )
      }
      onClickIconRight={() => setShowPassword((prevState) => !prevState)}
      type={showPassword ? "text" : "password"}
    />
  );
}
