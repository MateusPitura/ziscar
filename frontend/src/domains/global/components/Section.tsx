import classNames from "classnames";
import { Childrenable } from "../types";

function Container({ children }: Childrenable) {
  return <div className="flex flex-col gap-x-4 gap-y-2 w-[56rem]">{children}</div>;
}

function Group({ children }: Childrenable) {
  return <div className="rounded-md overflow-hidden">{children}</div>;
}

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <div className="px-4 py-2">
      <span className="text-body-large text-neutral-700 font-bold">{title}</span>
    </div>
  );
}

interface SectionBodyProps extends Childrenable {
  className?: string;
}

function Body({ children, className }: SectionBodyProps) {
  return (
    <div className={classNames("px-4 py-2 grid grid-cols-2 gap-x-4 gap-y-2", className)}>
      {children}
    </div>
  );
}

const Section = Object.assign(Container, { Group, Header, Body });

export default Section;
