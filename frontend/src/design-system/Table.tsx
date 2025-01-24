import classNames from "classnames";
import type { ReactElement, ReactNode } from "react";
import Button from "./Button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";

interface TableProps {
  children: ReactNode;
}

function Table({ children }: TableProps): ReactElement {
  return (
    <div className="overflow-x-auto flex flex-1">
      <div className="min-w-[50rem] w-full flex flex-col">{children}</div>
    </div>
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

function Row({ children, className }: HeaderProps) {
  return (
    <div
      className={classNames(
        "p-4 grid grid-cols-12 gap-2 bg-light-surfaceContainerLowest h-[72px] items-center border-b border-neutral-300",
        className
      )}
    >
      {children}
    </div>
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

function Header({ children, className }: HeaderProps) {
  return (
    <Row
      className={classNames(
        "bg-light-tertiaryContainer rounded-t-md border-none",
        className
      )}
    >
      {children}
    </Row>
  );
}

interface CellProps {
  label?: string;
  className?: string;
}

function Cell({ label, className }: CellProps) {
  return (
    <span
      className={classNames(
        "text-light-onTertiaryContainer text-body-medium flex-1 col-span-2 overflow-x-hidden",
        className
      )}
    >
      {label}
    </span>
  );
}

interface HeadProps {
  label?: string;
  className?: string;
}

function Head({ label, className }: HeadProps) {
  return (
    <Cell className={classNames("!text-body-large", className)} label={label} />
  );
}

interface BodyProps {
  children: ReactNode;
}

function Body({ children }: BodyProps) {
  return (
    <div className="flex-1 bg-light-surfaceContainerLowest overflow-y-auto">{children}</div>
  );
}

interface FooterProps {
  className?: string;
}

function Footer({ className }: FooterProps) {
  return (
    <Row
      className={classNames(
        "bg-light-tertiaryContainer rounded-b-md border-none",
        className
      )}
    >
      <div className="col-span-12 flex items-center gap-4 justify-end">
        <Button
          variant="quaternary"
          label="Exportar como planilha"
          iconRight={<FileDownloadOutlinedIcon />}
        />
        <Button
          variant="quaternary"
          label="Exportar como PDF"
          iconRight={<FileDownloadOutlinedIcon />}
        />
        <div>
          <span className="text-light-onTertiaryContainer text-body-large">
            1-10 de 100
          </span>
        </div>
        <Button variant="tertiary" iconLeft={<NavigateBeforeOutlinedIcon />} />
        <Button variant="tertiary" iconLeft={<NavigateNextOutlinedIcon />} />
      </div>
    </Row>
  );
}

Object.assign(Table, { Row, Cell, Header, Head, Body, Footer });

type TableType = typeof Table & {
  Row: typeof Row;
  Cell: typeof Cell;
  Header: typeof Header;
  Head: typeof Head;
  Body: typeof Body;
  Footer: typeof Footer;
};

export default Table as TableType;
