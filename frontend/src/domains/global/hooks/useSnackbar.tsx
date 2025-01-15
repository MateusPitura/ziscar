import Button from "@/design-system/Button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

interface ShowSuccessSnackbarProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onClick?: () => void;
}

export default function useSnackbar() {
  const { toast } = useToast();

  function showSuccessSnackbar({
    title,
    description,
    onClick,
    actionLabel
  }: ShowSuccessSnackbarProps) {
    toast({
      title,
      description,
      action: onClick && (
        <ToastAction altText="Action button">
          <Button
            variant="quaternary"
            label={actionLabel}
            padding="none"
            onClick={onClick}
          />
        </ToastAction>
      ),
    });
  }

  function showErrorSnackbar({
    title,
    description,
    onClick,
    actionLabel
  }: ShowSuccessSnackbarProps) {
    toast({
      variant: "destructive",
      title,
      description,
      action: onClick && (
        <ToastAction altText="Action button">
          <Button
            variant="primary"
            state="red"
            label={actionLabel}
            padding="none"
            onClick={onClick}
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
