import classNames from "classnames";

interface BaseButtonProps {
  state?: "active" | "disabled" | "red" | "loading";
  className?: string;
  label?: string;
  onClick: () => void;
  fullWidth?: boolean;
  textAlign?: "start" | "center" | "end";
}

function BaseButton({
  state = undefined,
  fullWidth = false,
  textAlign = "start",
  className,
  label,
  onClick,
}: BaseButtonProps) {
  return (
    <button
      className={classNames(
        "px-4 rounded-md h-10 hover:opacity-50",
        className,
        {
          "pointer-events-none opacity-50": state === "disabled",
          "pointer-events-none animate-pulse": state === "loading",
          "w-full": fullWidth,
        }
      )}
      onClick={onClick}
    >
      <span
        className={classNames("text-label-large flex", {
          "justify-center": textAlign === "center",
          "justify-start": textAlign === "start",
          "justify-end": textAlign === "end",
        })}
      >
        {label}
      </span>
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
            "bg-light-error": state === "red",
            "bg-light-outline": state === "disabled" || state === "loading",
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
              "border-light-error text-light-error": state === "red",
              "border-light-outline text-light-outline":
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
            "text-light-error": state === "red",
            "text-light-outline": state === "disabled" || state === "loading",
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
            "text-light-error": state === "red",
            "text-light-outline": state === "disabled" || state === "loading",
          })}
          state={state}
          {...props}
        />
      );
  }
}
