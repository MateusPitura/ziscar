import { useContext } from "react";
import { SignPageContext } from "../contexts/SignPageContext";

export default function useSignPageContext() {
  const context = useContext(SignPageContext);

  if (!context) {
    throw new Error(
      "useSignPageContext must be used within a SignPageProvider"
    );
  }
}
