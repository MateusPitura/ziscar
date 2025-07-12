import classNames from "classnames";
import { Childrenable } from "../types";

function Container({ children }: Childrenable) {
  return <div className="flex flex-col gap-4 w-[56rem]">{children}</div>;
}

function Group({ children }: Childrenable) {
  return <div className="rounded-md overflow-hidden">{children}</div>;
}

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <div className="p-4">
      <span className="text-body-large text-neutral-700 font-bold">{title}</span>
    </div>
  );
}

interface SectionBodyProps extends Childrenable {
  className?: string;
}

function Body({ children, className }: SectionBodyProps) {
  return (
    <div className={classNames("p-4 grid grid-cols-2 gap-4", className)}>
      {children}
    </div>
  );
}

const Section = Object.assign(Container, { Group, Header, Body });

export default Section;
