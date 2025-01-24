import classNames from "classnames";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import Button from "./Button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import LoadingSpinner from "@/domains/global/components/LoadingSpinner";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
        "p-4 grid grid-cols-10 gap-2 bg-light-surfaceContainerLowest h-[72px] items-center border-b border-neutral-300",
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

interface ActionProps {
  label?: string;
  className?: string;
}

function Cell({ label, className }: ActionProps) {
  return (
    <span
      className={classNames(
        "text-light-onTertiaryContainer text-body-medium col-span-2 overflow-x-hidden first:col-span-1 last:col-span-1",
        className
      )}
    >
      {label}
    </span>
  );
}

interface ActionProps {
  className?: string;
}

function Action({ className }: ActionProps) {
  return (
    <div
      className={classNames(
        "col-span-1 overflow-x-hidden",
        className
      )}
    >
      <Button
        variant="tertiary"
        iconRight={<MoreHorizIcon />}
      />
    </div>
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
  isEmpty?: boolean;
  isLoading?: boolean;
}

function Body({ children, isEmpty, isLoading }: BodyProps) {
  if (isLoading || isEmpty) {
    return (
      <div className="flex-1 bg-light-surfaceContainerLowest overflow-y-auto flex items-center justify-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <span className="text-light-onSurface text-body-medium">
            Nenhum item encontrado
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-light-surfaceContainerLowest overflow-y-auto">
      {children}
    </div>
  );
}

interface FooterProps {
  className?: string;
  onExportSpreadSheetCallback?: () => void;
  exportSpreadSheetBtnState?: ComponentProps<typeof Button>["state"];
  onExportPdfCallback?: () => void;
  exportPdfBtnState?: ComponentProps<typeof Button>["state"];
  onNavigateBeforeCallback?: () => void;
  navBeforeBtnState?: ComponentProps<typeof Button>["state"];
  onNavigateNextCallback?: () => void;
  navNextBtnState?: ComponentProps<typeof Button>["state"];
  currentStartItem?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

function Footer({
  className,
  currentStartItem,
  itemsPerPage,
  onExportPdfCallback,
  onExportSpreadSheetCallback,
  onNavigateBeforeCallback,
  onNavigateNextCallback,
  totalItems,
  exportPdfBtnState,
  exportSpreadSheetBtnState,
  navBeforeBtnState,
  navNextBtnState,
}: FooterProps) {
  return (
    <Row
      className={classNames(
        "bg-light-tertiaryContainer rounded-b-md border-none",
        className
      )}
    >
      <div className="col-span-12 flex items-center gap-4 justify-end">
        {onExportSpreadSheetCallback && (
          <Button
            variant="quaternary"
            label="Exportar como planilha"
            iconRight={<FileDownloadOutlinedIcon />}
            onClick={onExportSpreadSheetCallback}
            state={exportSpreadSheetBtnState}
          />
        )}
        {onExportPdfCallback && (
          <Button
            variant="quaternary"
            label="Exportar como PDF"
            iconRight={<FileDownloadOutlinedIcon />}
            onClick={onExportPdfCallback}
            state={exportPdfBtnState}
          />
        )}
        <div>
          <span className="text-light-onTertiaryContainer text-body-large">
            {currentStartItem && `${currentStartItem}`}
            {itemsPerPage && `-${itemsPerPage}`}
            {totalItems && ` de ${totalItems}`}
          </span>
        </div>
        {onNavigateBeforeCallback && (
          <Button
            variant="tertiary"
            iconLeft={<NavigateBeforeOutlinedIcon />}
            onClick={onNavigateBeforeCallback}
            state={navBeforeBtnState}
          />
        )}
        {onNavigateNextCallback && (
          <Button
            variant="tertiary"
            iconLeft={<NavigateNextOutlinedIcon />}
            onClick={onNavigateNextCallback}
            state={navNextBtnState}
          />
        )}
      </div>
    </Row>
  );
}

interface FilterProps {
  onFilterCallback: () => void;
  filterBtnState?: ComponentProps<typeof Button>["state"];
}

function Filter({ onFilterCallback, filterBtnState }: FilterProps) {
  return (
    <div className="mb-4 flex justify-end">
      <Button
        variant="secondary"
        label="Filtros"
        iconRight={<FilterListIcon />}
        onClick={onFilterCallback}
        state={filterBtnState}
      />
    </div>
  );
}

Object.assign(Table, { Row, Cell, Header, Head, Body, Footer, Filter, Action });

type TableType = typeof Table & {
  Row: typeof Row;
  Cell: typeof Cell;
  Header: typeof Header;
  Head: typeof Head;
  Body: typeof Body;
  Footer: typeof Footer;
  Filter: typeof Filter;
  Action: typeof Action;
};

export default Table as TableType;
