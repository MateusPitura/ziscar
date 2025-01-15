import { useToast } from "@/hooks/use-toast";
import type { ReactElement } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import classNames from "classnames";

export default function Snackbar(): ReactElement {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast
            key={id}
            variant={variant}
            {...props}
            className={classNames("bg-light-surfaceContainerLowest border-light-surfaceContainerLowest my-1", {
              "bg-light-error border-light-error": variant === "destructive",
            })}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle>
                  <span
                    className={classNames(
                      "text-light-onSurface text-title-medium",
                      {
                        "text-light-onError": variant === "destructive",
                      }
                    )}
                  >
                    {title}
                  </span>
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>
                  <span
                    className={classNames(
                      "text-light-onSurface text-body-medium",
                      {
                        "text-light-onError": variant === "destructive",
                      }
                    )}
                  >
                    {description}
                  </span>
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
