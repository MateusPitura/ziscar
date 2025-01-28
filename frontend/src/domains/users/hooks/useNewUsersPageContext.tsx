import { useContext } from "react";
import { NewUsersPageContext } from "../contexts/NewUsersPageContext";

export default function useNewUsersPageContext() {
  const context = useContext(NewUsersPageContext);

  if (!context) {
    throw new Error(
      "useNewUsersPageContext must be used within a NewUsersPageProvider"
    );
  }

  return context;
}
