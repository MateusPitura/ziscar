import Button from "@/design-system/Button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { ActionsType, ResourcesType } from "@shared/enums";
import { useCallback } from "react";

interface ShowSuccessSnackbarProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionBtnResource?: ResourcesType;
  actionBtnAction?: ActionsType;
}

interface ShowErrorSnackbarProps {
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionBtnResource?: ResourcesType;
  actionBtnAction?: ActionsType;
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
      return toast({
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
              tooltipMessage={undefined}
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
      return toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description,
        action: onActionClick && (
          <ToastAction altText="Action button" asChild>
            <Button
              variant="primary"
              label={actionLabel}
              color="red"
              padding="none"
              onClick={onActionClick}
              resource={actionBtnResource}
              action={actionBtnAction}
              tooltipMessage={undefined}
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
