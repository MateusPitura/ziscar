import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

type Step = "SIGN_IN" | "SIGN_UP" | "NEW_PASSWORD";

interface SignPageContextValues {
  step: Step;
  handleStep: (step: Step) => void;
}

const SignPageContext = createContext<SignPageContextValues | null>(null);

function SignPageProvider({ children }: Childrenable): ReactNode {
  const [searchParams] = useSearchParams();
  let token: string | null = null;
  if (searchParams.has("token")) {
    token = searchParams.get("token");
  }

  const [step, setStep] = useState<Step>(token ? "NEW_PASSWORD" : "SIGN_IN");

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
