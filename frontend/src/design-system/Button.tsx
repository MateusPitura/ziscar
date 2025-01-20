import classNames from "classnames";
import { ReactNode } from "react";

interface BaseButtonProps {
  state?: "active" | "disabled" | "red" | "loading";
  className?: string;
  label?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  textAlign?: "start" | "center" | "end";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  padding?: "default" | "none";
  type?: "submit" | "button";
}

function BaseButton({
  state = undefined,
  fullWidth = false,
  textAlign = "start",
  padding = "default",
  type = "button",
  className,
  label,
  iconLeft,
  iconRight,
  ...props
}: BaseButtonProps) {
  return (
    <button
      className={classNames(
        "rounded-md h-10 hover:opacity-50 flex items-center gap-4 w-fit",
        className,
        {
          "pointer-events-none": state === "disabled",
          "pointer-events-none animate-pulse": state === "loading",
          "!w-full": fullWidth,
          "px-4": padding === "default",
          "px-0": padding === "none",
        }
      )}
      type={type}
      {...props}
    >
      {iconLeft && <div className="flex flex-1 justify-center">{iconLeft}</div>}
      {label && (
        <span
          className={classNames("text-label-large flex w-full", {
            "justify-center": textAlign === "center",
            "justify-start": textAlign === "start",
            "justify-end": textAlign === "end",
          })}
        >
          {label}
        </span>
      )}
      {iconRight && (
        <div className="flex flex-1 justify-center">{iconRight}</div>
      )}
    </button>
  );
}

interface ButtonProps extends Omit<BaseButtonProps, "className"> {
  variant: "primary" | "secondary" | "tertiary" | "quaternary";
}

export default function Button({
  variant = "primary",
  state = undefined,
  ...props
}: ButtonProps) {
  switch (variant) {
    case "primary":
      return (
        <BaseButton
          className={classNames("bg-light-primary text-light-onPrimary", {
            "bg-light-secondary": state === "active",
            "!bg-light-error": state === "red",
            "!bg-neutral-300": state === "disabled" || state === "loading",
          })}
          state={state}
          {...props}
        />
      );
    case "secondary":
      return (
        <BaseButton
          className={classNames(
            "border-light-primary border-2 text-light-primary",
            {
              "bg-light-primaryContainer": state === "active",
              "!border-light-error !text-light-error": state === "red",
              "border-neutral-300 text-neutral-300":
                state === "disabled" || state === "loading",
            }
          )}
          state={state}
          {...props}
        />
      );
    case "tertiary":
      return (
        <BaseButton
          className={classNames("text-light-onSurface", {
            "text-light-primary": state === "active",
            "!text-light-error": state === "red",
            "text-neutral-300": state === "disabled" || state === "loading",
          })}
          state={state}
          {...props}
        />
      );
    case "quaternary":
      return (
        <BaseButton
          className={classNames("text-light-primary", {
            "bg-light-primaryContainer": state === "active",
            "!text-light-error": state === "red",
            "text-neutral-300": state === "disabled" || state === "loading",
          })}
          state={state}
          {...props}
        />
      );
  }
}
