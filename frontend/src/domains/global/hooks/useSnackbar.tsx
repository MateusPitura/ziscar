import Button from "@/design-system/Button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useCallback } from "react";
import { Resource, Action } from "../types/model";

interface ShowSnackbarProps {
  title: string;
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
    }: ShowSnackbarProps) => {
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
      title,
      description,
      onActionClick,
      actionLabel,
      actionBtnResource,
      actionBtnAction,
    }: ShowSnackbarProps) => {
      toast({
        variant: "destructive",
        title,
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
