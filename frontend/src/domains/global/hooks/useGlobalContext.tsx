import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

export default function useGlobalContext() {
  return useContext(GlobalContext);
}
