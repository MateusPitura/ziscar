import classNames from "classnames";
import { forwardRef, ReactNode } from "react";
import Tooltip from "./Tooltip";
import useCheckPermission from "@/domains/global/hooks/useCheckPermission";
import formatDeniedMessage from "@/domains/global/utils/formatDeniedMessage";
import { Resource, Action } from "@/domains/global/types/model";

export type ButtonState = "active" | "disabled" | "red" | "loading";

interface BaseButtonProps {
  state?: ButtonState;
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

const BaseButton = forwardRef(
  (
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
    }: BaseButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
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
        {iconLeft && (
          <div className="flex flex-1 justify-center">{iconLeft}</div>
        )}
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
);

interface SafeButtonProps extends BaseButtonProps {
  resource?: Resource;
  action?: Action;
}

const SafeButton = forwardRef(
  (
    { resource, action, onClick, className, ...props }: SafeButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const hasPermission = useCheckPermission(resource, action);

    return (
      <Tooltip
        content={formatDeniedMessage({ resource, action })}
        disabled={hasPermission}
      >
        <div
          className={classNames({
            "cursor-not-allowed opacity-50": !hasPermission,
          })}
        >
          <BaseButton
            {...props}
            ref={ref}
            onClick={hasPermission ? onClick : () => {}}
            className={classNames(className, {
              "pointer-events-none": !hasPermission,
            })}
          />
        </div>
      </Tooltip>
    );
  }
);

interface ButtonProps
  extends Omit<BaseButtonProps, "className">,
    SafeButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
}

const Button = forwardRef(
  (
    { variant = "primary", state = undefined, ...props }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    switch (variant) {
      case "primary":
        return (
          <SafeButton
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
          <SafeButton
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
          <SafeButton
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
          <SafeButton
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
);

export default Button;
