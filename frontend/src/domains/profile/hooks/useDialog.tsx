import { useState } from "react";
import { useCallback } from "react";

export default function useDialog() {
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleDialog = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return { open, setOpen, openDialog, closeDialog, toggleDialog };
}
