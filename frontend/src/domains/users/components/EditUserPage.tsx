import type { ReactNode } from "react";
import { EditUserPageProvider } from "../contexts/EditUserPageContext";
import EditUserContainer from "./EditUserContainer";

export default function EditUserPage(): ReactNode {
  return (
    <EditUserPageProvider>
      <EditUserContainer />
    </EditUserPageProvider>
  );
}
