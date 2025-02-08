import Button, { ButtonState } from "@/design-system/Button";
import useDirty from "@/domains/global/hooks/useDirty";
import { Childrenable } from "@/domains/global/types/components";
import { useMemo, type ReactNode } from "react";

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
}

function Footer({
  label,
  variant = "primary",
  primaryBtnState,
}: ButtonProps): ReactNode {
  const { isDirty } = useDirty({ dirty: true });

  const primaryBtnStateParsed = useMemo(() => {
    if (primaryBtnState) return primaryBtnState;
    if (!isDirty) return "disabled";
  }, [primaryBtnState, isDirty]);

  return (
    <Button
      label={label}
      textAlign="center"
      variant={variant}
      state={primaryBtnStateParsed}
      fullWidth
      type="submit"
    />
  );
}

const SignCard = Object.assign(Container, { Footer });

export default SignCard;
