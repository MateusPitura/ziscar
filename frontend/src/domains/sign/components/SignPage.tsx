import type { ReactNode } from "react";
import { SignPageProvider } from "../contexts/SignPageContext";
import SignContainer from "./SignContainer";

export default function SignPage(): ReactNode {
  return (
    <SignPageProvider>
      <SignContainer />
    </SignPageProvider>
  );
}
