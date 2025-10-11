import classNames from "classnames";
import { ReactNode } from "react";
import { Childrenable } from "../types";

function Container({ children }: Childrenable) {
  return <div className="flex flex-col gap-x-4 gap-y-1 xl:w-[56rem] w-[40rem]">{children}</div>;
}

function Group({ children }: Childrenable) {
  return <div className="rounded-md overflow-hidden">{children}</div>;
}

interface HeaderProps {
  title: ReactNode;
}

function Header({ title }: HeaderProps) {
  return (
    <div className="px-4 py-1">
      <span className="text-body-large text-neutral-700 font-bold">{title}</span>
    </div>
  );
}

interface SectionBodyProps extends Childrenable {
  className?: string;
}

function Body({ children, className }: SectionBodyProps) {
  return (
    <div className={classNames("px-4 py-1 grid grid-cols-2 gap-x-4 gap-y-1", className)}>
      {children}
    </div>
  );
}

const Section = Object.assign(Container, { Group, Header, Body });

export default Section;
