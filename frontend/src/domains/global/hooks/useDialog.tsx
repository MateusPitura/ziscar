import { useState } from "react";
import { useCallback } from "react";
import { Dialog } from "../types";

export default function useDialog(): Dialog {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDialog = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleOpen = useCallback((state: boolean) => {
    setIsOpen(state);
  }, []);

  return { isOpen, handleOpen, openDialog, closeDialog, toggleDialog };
}
