import { Childrenable } from "@/domains/global/types/components";
import { createContext, useMemo, useState, ReactNode } from "react";

type Step = "SIGN_IN" | "SIGN_UP" | "NEW_PASSWORD";

interface SignPageContextValues {
  step: Step;
  handleStep: (step: Step) => void;
}

const SignPageContext = createContext<SignPageContextValues | null>(null);

function SignPageProvider({ children }: Childrenable): ReactNode {
  const [step, setStep] = useState<Step>("SIGN_IN");

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
