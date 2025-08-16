import { NewUserPageProvider } from "../contexts/NewUserPageContext";
import NewUserContainer from "./NewUserContainer";

export default function NewUserPage() {
  return (
    <NewUserPageProvider>
      <NewUserContainer />
    </NewUserPageProvider>
  );
}
