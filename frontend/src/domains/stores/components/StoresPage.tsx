import { StoresPageProvider } from "../contexts/StoresPageContext";
import StoresContainer from "./StoresContainer";

export default function StoresPage() {
  return (
    <StoresPageProvider>
      <StoresContainer />
    </StoresPageProvider>
  );
}
