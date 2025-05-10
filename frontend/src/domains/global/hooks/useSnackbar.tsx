import Button from "@/design-system/Button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Action, Resource } from "@shared/types";
import { useCallback } from "react";

interface ShowSuccessSnackbarProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionBtnResource?: Resource;
  actionBtnAction?: Action;
}

interface ShowErrorSnackbarProps {
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionBtnResource?: Resource;
  actionBtnAction?: Action;
}

export default function useSnackbar() {
  const { toast } = useToast();

  const showSuccessSnackbar = useCallback(
    ({
      title,
      description,
      onActionClick,
      actionLabel,
      actionBtnResource,
      actionBtnAction,
    }: ShowSuccessSnackbarProps) => {
      toast({
        title,
        description,
        action: onActionClick && (
          <ToastAction altText="Action button" asChild>
            <Button
              variant="quaternary"
              label={actionLabel}
              padding="none"
              onClick={onActionClick}
              resource={actionBtnResource}
              action={actionBtnAction}
            />
          </ToastAction>
        ),
      });
    },
    [toast]
  );

  const showErrorSnackbar = useCallback(
    ({
      description,
      onActionClick,
      actionLabel,
      actionBtnResource,
      actionBtnAction,
    }: ShowErrorSnackbarProps) => {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description,
        action: onActionClick && (
          <ToastAction altText="Action button" asChild>
            <Button
              variant="primary"
              state="red"
              label={actionLabel}
              padding="none"
              onClick={onActionClick}
              resource={actionBtnResource}
              action={actionBtnAction}
            />
          </ToastAction>
        ),
      });
    },
    [toast]
  );

  return {
    showSuccessSnackbar,
    showErrorSnackbar,
  };
}
