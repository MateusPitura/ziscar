import { BranchesPageProvider } from "../contexts/BranchesPageContext";
import BranchesContainer from "./BranchesContainer";

export default function BranchesPage() {
  return (
    <BranchesPageProvider>
      <BranchesContainer />
    </BranchesPageProvider>
  );
}
