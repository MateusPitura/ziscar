import Dialog from "@/design-system/Dialog";
import type { ReactNode } from "react";
import ForgetPasswordForm from "../forms/ForgetPasswordForm";
import { DialogProps } from "@/domains/global/types";

export default function ForgetPasswordModal({ ...dialog }: DialogProps): ReactNode {
  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Recuperar senha" />
      <ForgetPasswordForm />
    </Dialog>
  );
}
