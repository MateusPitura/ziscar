import classNames from "classnames";
import { forwardRef, ReactNode } from "react";

interface PrimitiveButtonProps {
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

function PrimitiveButton(
  {
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
  }: PrimitiveButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
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
      disabled={state === "disabled" || state === "loading"}
      type={type}
      ref={ref}
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

const BaseButtonWithRef = forwardRef(PrimitiveButton);

interface BaseButtonProps extends Omit<PrimitiveButtonProps, "className"> {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
}

function BaseButton(
  { variant = "primary", state = undefined, ...props }: BaseButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  switch (variant) {
    case "primary":
      return (
        <BaseButtonWithRef
          className={classNames("bg-light-primary text-light-onPrimary", {
            "bg-light-secondary": state === "active",
            "!bg-light-error": state === "red",
            "!bg-neutral-300": state === "disabled" || state === "loading",
          })}
          state={state}
          ref={ref}
          {...props}
        />
      );
    case "secondary":
      return (
        <BaseButtonWithRef
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
          ref={ref}
          {...props}
        />
      );
    case "tertiary":
      return (
        <BaseButtonWithRef
          className={classNames("text-light-onSurface", {
            "text-light-primary": state === "active",
            "!text-light-error": state === "red",
            "text-neutral-300": state === "disabled" || state === "loading",
          })}
          state={state}
          ref={ref}
          {...props}
        />
      );
    case "quaternary":
      return (
        <BaseButtonWithRef
          className={classNames("text-light-primary", {
            "bg-light-primaryContainer": state === "active",
            "!text-light-error": state === "red",
            "text-neutral-300": state === "disabled" || state === "loading",
          })}
          state={state}
          ref={ref}
          {...props}
        />
      );
  }
}

const Button = forwardRef(BaseButton);

export default Button;
