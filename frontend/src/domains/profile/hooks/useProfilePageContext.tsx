import { useContext } from "react";
import { ProfilePageContext } from "../contexts/ProfilePageContext";

export default function useProfilePageContext() {
  return useContext(ProfilePageContext);
}
