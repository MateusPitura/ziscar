import { BranchesPageProvider } from "../contexts/BranchesPageContext";

export default function BranchesPage() {
  return (
    <BranchesPageProvider>
      <BranchesPage />
    </BranchesPageProvider>
  );
}
