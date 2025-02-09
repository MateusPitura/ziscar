import Modal from "@/design-system/Modal";
import { Dialog } from "@/domains/global/types/components";
import type { ReactNode } from "react";
import ForgetPasswordForm from "../forms/ForgetPasswordForm";

export default function ForgetPasswordModal({ ...dialog }: Dialog): ReactNode {
  return (
    <Modal {...dialog}>
      <Modal.Header title="Recuperar senha" />
      <ForgetPasswordForm />
    </Modal>
  );
}
