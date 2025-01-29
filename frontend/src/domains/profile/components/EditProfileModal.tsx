import Modal from "@/design-system/Modal";
import { Dialog } from "@/domains/global/types/components";
import type { ReactNode } from "react";
import { EditProfile } from "../types/editProfile";

interface EditProfileModalProps extends Dialog, EditProfile {}

export default function EditProfileModal({
  content,
  onClose,
  open,
  title,
}: EditProfileModalProps): ReactNode {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header title={title} />
      {content}
    </Modal>
  );
}
