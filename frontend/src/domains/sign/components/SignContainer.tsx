import { useMemo, type ReactNode } from "react";
import SignCard from "./SignCard";
import NewPasswordForm from "../forms/NewPasswordForm";
import SignInForm from "../forms/SignInForm";
import useSignPageContext from "../hooks/useSignPageContext";
import SignUpForm from "../forms/SignUpForm";

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
      case "SIGN_UP": {
        return (
          <SignCard title="Criar conta">
            <SignUpForm />
          </SignCard>
        );
      }
      default:
        return (
          <SignCard title="Login">
            <SignInForm />
          </SignCard>
        );
    }
  }, [step]);

  return (
    <div className="bg-neutral-50 w-full h-screen flex justify-center items-center flex-col gap-4">
      <span className="text-headline-large text-neutral-700">Ziscar</span>
      <div className="border-b border-neutral-300 w-96" />
      {renderStep}
    </div>
  );
}
