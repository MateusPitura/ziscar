import { NewUsersPageProvider } from "../contexts/NewUsersPageContext";
import NewUsersContainer from "./NewUsersContainer";

export default function NewUsersPage() {
  return (
    <NewUsersPageProvider>
      <NewUsersContainer />
    </NewUsersPageProvider>
  );
}
