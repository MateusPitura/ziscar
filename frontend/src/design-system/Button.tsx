import classNames from "classnames";
import { forwardRef, ReactNode } from "react";
import Tooltip from "./Tooltip";
import useCheckPermission from "@/domains/global/hooks/useCheckPermission";
import { ButtonColor, ButtonState, IconsName } from "./types";
import { formatDeniedMessage } from "@shared/utils/formatDeniedMessage";
import Icon from "./Icon";
import { ActionsType, ResourcesType } from "@shared/enums";

interface BaseButtonProps {
  state?: ButtonState;
  className?: string;
  label?: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  textAlign?: "start" | "center" | "end";
  iconLeft?: IconsName;
  iconRight?: IconsName;
  padding?: "default" | "none";
  type?: "submit" | "button";
  color?: ButtonColor;
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
          <div className="flex flex-1 justify-center">
            <Icon iconName={iconLeft} />
          </div>
        )}
        {label && (
          <span
            className={classNames("text-label-large flex w-full truncate", {
              "justify-center": textAlign === "center",
              "justify-start": textAlign === "start",
              "justify-end": textAlign === "end",
            })}
          >
            {label}
          </span>
        )}
        {iconRight && (
          <div className="flex flex-1 justify-center">
            {<Icon iconName={iconRight} />}
          </div>
        )}
      </button>
    );
  }
);

interface ButtonVariantProps extends BaseButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
}

const ButtonVariant = forwardRef(
  (
    {
      variant = "primary",
      state = undefined,
      className,
      color = "gray",
      ...props
    }: ButtonVariantProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    switch (variant) {
      case "primary":
        return (
          <BaseButton
            className={classNames("text-neutral-100", className, {
              "!bg-neutral-300": state === "disabled" || state === "loading",
              "bg-neutral-800": color === "gray",
              "bg-green-600": color === "green",
              "bg-blue-800": color === "darkBlue",
              "bg-sky-500": color === "lightBlue",
              "bg-red-500": color === "red",
            })}
            state={state}
            ref={ref}
            {...props}
          />
        );
      case "secondary":
        return (
          <BaseButton
            className={classNames(
              "border-slate-800 border-2 text-slate-800",
              className,
              {
                "!border-neutral-300 !text-neutral-300":
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
          <BaseButton
            className={classNames("text-neutral-100", className, {
              "!text-neutral-300": state === "disabled" || state === "loading",
            })}
            state={state}
            ref={ref}
            {...props}
          />
        );
      case "quaternary":
        return (
          <BaseButton
            className={classNames("text-slate-800", className, {
              "!text-neutral-300": state === "disabled" || state === "loading",
              "!text-red-500": color === "red",
            })}
            state={state}
            ref={ref}
            {...props}
          />
        );
    }
  }
);

interface ButtonProps extends ButtonVariantProps {
  resource?: ResourcesType;
  action?: ActionsType;
  renderIfNoPermission?: boolean;
}

const Button = forwardRef(
  (
    {
      resource,
      action,
      onClick,
      state,
      renderIfNoPermission = false,
      ...props
    }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const hasPermission = useCheckPermission(resource, action);

    if (!renderIfNoPermission && !hasPermission) {
      return null;
    }

    return (
      <Tooltip
        content={formatDeniedMessage({ resource, action })}
        disabled={hasPermission}
      >
        <div className={classNames({ "cursor-not-allowed": !hasPermission })}>
          <ButtonVariant
            {...props}
            ref={ref}
            onClick={hasPermission ? onClick : () => {}}
            state={hasPermission ? state : "disabled"}
          />
        </div>
      </Tooltip>
    );
  }
);

export default Button;
