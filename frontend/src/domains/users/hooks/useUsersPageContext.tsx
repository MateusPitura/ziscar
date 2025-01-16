import { useContext } from "react";
import { UsersPageContext } from "../contexts/UsersPageContext";

export default function useUsersPageContext() {
  return useContext(UsersPageContext);
}
