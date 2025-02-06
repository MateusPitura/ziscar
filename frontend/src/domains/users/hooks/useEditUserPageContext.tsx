import { useContext } from "react";
import { EditUserPageContext } from "../contexts/EditUserPageContext";

export default function useEditUserPageContext() {
  const context = useContext(EditUserPageContext);

  if (!context) {
    throw new Error(
      "useEditUserPageContext must be used within a EditUserPageContextProvider"
    );
  }
}
