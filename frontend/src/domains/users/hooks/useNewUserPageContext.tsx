import { useContext } from "react";
import { NewUserPageContext } from "../contexts/NewUserPageContext";

export default function useNewUserPageContext() {
  const context = useContext(NewUserPageContext);

  if (!context) {
    throw new Error(
      "useNewUserPageContext must be used within a NewUserPageProvider"
    );
  }

  return context;
}
