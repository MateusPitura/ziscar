import { type ReactElement } from "react";
import { ProfilePageProvider } from "../contexts/ProfilePageContext";
import ProfileContainer from "./ProfileContainer";

export default function ProfilePage(): ReactElement {
  return (
    <ProfilePageProvider>
      <ProfileContainer />
    </ProfilePageProvider>
  );
}
