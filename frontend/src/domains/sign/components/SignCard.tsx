import Button from "@/design-system/Button";
import { ButtonState } from "@/design-system/types";
import useButtonState from "@/domains/global/hooks/useButtonState";
import { Childrenable } from "@/domains/global/types";
import { type ReactNode } from "react";

interface ContainerProps extends Childrenable {
  title: string;
}

function Container({ title, children }: ContainerProps): ReactNode {
  return (
    <div className="w-[23rem] h-[41rem] bg-neutral-50 shadow-md px-4 py-8 flex flex-col gap-8 rounded-md">
      <span className="text-headline-large text-neutral-700 text-center">
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
  secondaryBtnLabel?: string;
  onClickSecondaryBtn?: () => void;
}

function Footer({
  label,
  variant = "primary",
  primaryBtnState,
  secondaryBtnLabel,
  onClickSecondaryBtn,
}: ButtonProps): ReactNode {
  const primaryBtnStateParsed = useButtonState({
    buttonState: primaryBtnState,
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        label={label}
        textAlign="center"
        variant={variant}
        state={primaryBtnStateParsed}
        fullWidth
        type="submit"
        tooltipMessage={undefined}
      />
      {secondaryBtnLabel && (
        <div className="flex-1 flex justify-center">
          <Button
            label={secondaryBtnLabel}
            textAlign="center"
            variant="quaternary"
            tooltipMessage={undefined}
            onClick={onClickSecondaryBtn}
          />
        </div>
      )}
    </div>
  );
}

const SignCard = Object.assign(Container, { Footer });

export default SignCard;
