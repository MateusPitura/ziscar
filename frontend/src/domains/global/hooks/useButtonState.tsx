import { ButtonState } from "@/design-system/Button";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

interface UseButtonProperties {
  dirty?: boolean;
  buttonState?: ButtonState;
}

export default function useButtonState({
  dirty = true,
  buttonState,
}: UseButtonProperties): ButtonState | undefined {
  const formContext = useFormContext();

  return useMemo(() => {
    if (!formContext) return buttonState;
    if (buttonState) return buttonState;
    if (dirty && !formContext.formState.isDirty) return "disabled";
  }, [buttonState, formContext, dirty]);
}
