import Dialog from "@/design-system/Dialog";
import type { ReactNode } from "react";
import { EditProfile } from "../types";
import { DialogProps } from "@/domains/global/types";

interface EditProfileModalProps extends DialogProps, EditProfile {}

export default function EditProfileModal({
  title,
  content,
  ...dialog
}: EditProfileModalProps): ReactNode {
  return (
    <Dialog {...dialog}>
      <Dialog.Header title={title} />
      {content}
    </Dialog>
  );
}
