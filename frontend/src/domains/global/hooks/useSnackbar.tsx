import Button from "@/design-system/Button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

interface ShowSnackbarProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export default function useSnackbar() {
  const { toast } = useToast();

  function showSuccessSnackbar({
    title,
    description,
    onActionClick,
    actionLabel,
  }: ShowSnackbarProps) {
    toast({
      title,
      description,
      action: onActionClick && (
        <ToastAction altText="Action button">
          <Button
            variant="quaternary"
            label={actionLabel}
            padding="none"
            onClick={onActionClick}
          />
        </ToastAction>
      ),
    });
  }

  function showErrorSnackbar({
    title,
    description,
    onActionClick,
    actionLabel,
  }: ShowSnackbarProps) {
    toast({
      variant: "destructive",
      title,
      description,
      action: onActionClick && (
        <ToastAction altText="Action button">
          <Button
            variant="primary"
            state="red"
            label={actionLabel}
            padding="none"
            onClick={onActionClick}
          />
        </ToastAction>
      ),
    });
  }

  return {
    showSuccessSnackbar,
    showErrorSnackbar,
  };
}
