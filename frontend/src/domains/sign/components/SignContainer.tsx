import { useMemo, type ReactNode } from "react";
import SignCard from "./SignCard";
import NewPasswordForm from "../forms/NewPasswordForm";
import SignInForm from "../forms/SignInForm";
import useSignPageContext from "../hooks/useSignPageContext";

export default function SignContainer(): ReactNode {
  const { step } = useSignPageContext();

  const renderStep = useMemo(() => {
    switch (step) {
      case "NEW_PASSWORD": {
        return (
          <SignCard title="Criar nova senha">
            <NewPasswordForm />
          </SignCard>
        );
      }
      default:
        return (
          <SignCard title="Projeto de Software">
            <SignInForm />
          </SignCard>
        );
    }
  }, [step]);

  return (
    <div className="bg-gradient-to-br from-light-tertiaryContainer to-light-primary w-full h-screen flex justify-center items-center">
      {renderStep}
    </div>
  );
}
