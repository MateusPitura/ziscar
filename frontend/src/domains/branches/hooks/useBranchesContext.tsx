import { useContext } from "react";
import { BranchesPageContext } from "../contexts/BranchesPageContext";

export default function useBranchesPageContext() {
  return useContext(BranchesPageContext);
}
