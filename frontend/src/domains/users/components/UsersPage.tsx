import { UsersPageProvider } from "../contexts/UsersPageContext";
import UsersContainer from "./UsersContainer";

export default function UsersPage() {
  return (
    <UsersPageProvider>
      <UsersContainer />
    </UsersPageProvider>
  );
}
