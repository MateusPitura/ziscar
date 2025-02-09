import Button, { ButtonState } from "@/design-system/Button";
import useButtonState from "@/domains/global/hooks/useButtonState";
import { Childrenable } from "@/domains/global/types/components";
import { type ReactNode } from "react";
import useSignPageContext from "../hooks/useSignPageContext";

interface ContainerProps extends Childrenable {
  title: string;
}

function Container({ title, children }: ContainerProps): ReactNode {
  return (
    <div className="w-[23rem] h-[41rem] bg-light-surfaceContainerLowest px-4 py-8 flex flex-col gap-8 rounded-md">
      <span className="text-headline-large text-light-onSurface text-center">
        {title}
      </span>
      {children}
    </div>
  );
}

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  primaryBtnState?: ButtonState;
  cancelBtn?: boolean;
}

function Footer({
  label,
  variant = "primary",
  primaryBtnState,
  cancelBtn = false,
}: ButtonProps): ReactNode {
  const primaryBtnStateParsed = useButtonState({
    buttonState: primaryBtnState,
  });

  const { handleStep } = useSignPageContext();

  return (
    <div className="flex flex-col gap-2">
      <Button
        label={label}
        textAlign="center"
        variant={variant}
        state={primaryBtnStateParsed}
        fullWidth
        type="submit"
      />
      {cancelBtn && (
        <div className="flex-1 flex justify-center">
          <Button
            label="Cancelar"
            textAlign="center"
            variant="quaternary"
            onClick={() => handleStep("SIGN_IN")}
          />
        </div>
      )}
    </div>
  );
}

const SignCard = Object.assign(Container, { Footer });

export default SignCard;
