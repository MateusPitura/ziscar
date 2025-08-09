import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState, ReactNode } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { verifyNewPasswordRoute } from "../utils";

type Step = "SIGN_IN" | "SIGN_UP" | "NEW_PASSWORD";

interface SignPageContextValues {
  step: Step;
  handleStep: (step: Step) => void;
}

const SignPageContext = createContext<SignPageContextValues | null>(null);

function SignPageProvider({ children }: Childrenable): ReactNode {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isNewPasswordRoute = verifyNewPasswordRoute(searchParams);
  const isNewAccountRoute = location.pathname.includes("new-account");

  const [step, setStep] = useState<Step>(
    isNewPasswordRoute
      ? "NEW_PASSWORD"
      : isNewAccountRoute
      ? "SIGN_UP"
      : "SIGN_IN"
  );

  function handleStep(step: Step) {
    setStep(step);
  }

  const valuesMemoized = useMemo(
    () => ({
      step,
      handleStep,
    }),
    [step]
  );

  return (
    <SignPageContext.Provider value={valuesMemoized}>
      {children}
    </SignPageContext.Provider>
  );
}

export { SignPageContext, SignPageProvider };
