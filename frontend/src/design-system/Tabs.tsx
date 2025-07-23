import { Childrenable } from "@/domains/global/types";
import classNames from "classnames";
import { type ReactNode } from "react";
import Button from "./Button";

function Container({ children }: Childrenable): ReactNode {
  return <div className="flex-1 flex flex-col">{children}</div>;
}

interface TabProperties {
  title: string;
  isActive: boolean;
  onClick: () => void;
  hasError?: boolean;
}

function Tab({ title, isActive, onClick, hasError }: TabProperties): ReactNode {
  return (
    <div
      className={classNames(
        "flex flex-col items-center rounded-t-md border border-transparent relative top-[1px]",
        {
          "!border-neutral-300 !border-b-neutral-50 shadow-lg": isActive,
        }
      )}
    >
      <Button
        label={title}
        variant="quaternary"
        onClick={onClick}
        color={hasError ? "red" : undefined}
      />
    </div>
  );
}

function Header({ children }: Childrenable): ReactNode {
  return (
    <div className="flex gap-8 border-neutral-300 w-full border-b px-4">
      {children}
    </div>
  );
}

function Body({ children }: Childrenable): ReactNode {
  return <div className="bg-neutral-50 flex-1 z-10 relative flex justify-center py-4">{children}</div>;
}

interface SectionProperties extends Childrenable {
  isActive?: boolean;
}

function Section({ children, isActive }: SectionProperties): ReactNode {
  return <div className={classNames({ hidden: !isActive })}>{children}</div>;
}

const Tabs = Object.assign(Container, { Header, Tab, Body, Section });

export default Tabs;
