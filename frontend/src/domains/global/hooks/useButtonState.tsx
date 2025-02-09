import { ButtonState } from "@/design-system/Button";
import { useMemo } from "react";
import { useFormState } from "react-hook-form";

interface UseButtonProperties {
  dirty?: boolean;
  buttonState?: ButtonState;
}

export default function useButtonState({
  dirty = true,
  buttonState,
}: UseButtonProperties): ButtonState | undefined {
  const { isDirty } = useFormState();

  return useMemo(() => {
    if (buttonState) return buttonState;
    if (dirty && !isDirty) return "disabled";
  }, [buttonState, isDirty, dirty]);
}
