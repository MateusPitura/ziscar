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
            className={classNames(
              "bg-white border-white mt-2 [&>button]:!ring-0 [&>button]!outline-none [&>button]:!ring-offset-0",
              {
                "bg-red-500 border-red-500": variant === "destructive",
              }
            )}
          >
            <div className="grid gap-1 flex-1 overflow-hidden">
              {title && (
                <ToastTitle>
                  <span
                    className={classNames(
                      "text-neutral-700 text-title-medium line-clamp-1",
                      {
                        "!text-white": variant === "destructive",
                      }
                    )}
                    data-cy="snackbar-title"
                  >
                    {title}
                  </span>
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>
                  <span
                    className={classNames(
                      "text-neutral-700 text-body-medium line-clamp-1",
                      {
                        "!text-white": variant === "destructive",
                      }
                    )}
                  >
                    {description}
                  </span>
                </ToastDescription>
              )}
            </div>
            {action && <div>{action}</div>}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
