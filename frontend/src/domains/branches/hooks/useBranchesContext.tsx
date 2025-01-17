import { useContext } from "react";
import { BranchesPageContext } from "../contexts/BranchesPageContext";

export default function useBranchesPageContext() {
  const context = useContext(BranchesPageContext);

  if (!context) {
    throw new Error(
      "useBranchesPageContext must be used within a BranchesPageProvider"
    );
  }

  return context;
}
