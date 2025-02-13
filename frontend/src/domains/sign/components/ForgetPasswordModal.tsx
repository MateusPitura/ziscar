import Modal from "@/design-system/Modal";
import type { ReactNode } from "react";
import ForgetPasswordForm from "../forms/ForgetPasswordForm";
import { Dialog } from "@/domains/global/types";

export default function ForgetPasswordModal({ ...dialog }: Dialog): ReactNode {
  return (
    <Modal {...dialog}>
      <Modal.Header title="Recuperar senha" />
      <ForgetPasswordForm />
    </Modal>
  );
}
