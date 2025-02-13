import Modal from "@/design-system/Modal";
import { Dialog } from "@/domains/global/types";
import type { ReactNode } from "react";
import { EditProfile } from "../types";

interface EditProfileModalProps extends Dialog, EditProfile {}

export default function EditProfileModal({
  title,
  content,
  ...dialog
}: EditProfileModalProps): ReactNode {
  return (
    <Modal {...dialog}>
      <Modal.Header title={title} />
      {content}
    </Modal>
  );
}
