import type { ReactNode } from "react";
import { EditUserPageContextProvider } from "../contexts/EditUserPageContext";
import EditUserContainer from "./EditUserContainer";

export default function EditUserPage(): ReactNode {
  return (
    <EditUserPageContextProvider>
      <EditUserContainer />
    </EditUserPageContextProvider>
  );
}
