import { useContext } from "react";
import { UsersPageContext } from "../contexts/UsersPageContext";

export default function useUsersPageContext() {
  const context = useContext(UsersPageContext);

  if (!context) {
    throw new Error(
      "useUsersPageContext must be used within a UsersPageProvider"
    );
  }

  return context;
}
