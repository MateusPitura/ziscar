import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

interface UseDirtyProperties {
  dirty?: boolean;
}

export default function useDirty({ dirty }: UseDirtyProperties) {
  const formContext = useFormContext();

  const isDirty = useMemo(() => {
    if (!formContext || !dirty) return true;
    return formContext.formState.isDirty;
  }, [dirty, formContext]);

  return { isDirty };
}
