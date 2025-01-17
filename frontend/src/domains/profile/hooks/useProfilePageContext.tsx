import { useContext } from "react";
import { ProfilePageContext } from "../contexts/ProfilePageContext";

export default function useProfilePageContext() {
  const context = useContext(ProfilePageContext);

  if (!context) {
    throw new Error(
      "useProfilePageContext must be used within a ProfilePageProvider"
    );
  }

  return context;
}
