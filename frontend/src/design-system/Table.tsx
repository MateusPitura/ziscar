import classNames from "classnames";
import {
  Children,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import Button from "./Button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import LoadingSpinner from "@/domains/global/components/LoadingSpinner";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Popover } from "./Popover";
import SideSheet from "./SideSheet";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps): ReactElement {
  return (
    <div className="overflow-x-auto flex flex-1">
      <div className="min-w-[50rem] w-full flex flex-col">{children}</div>
    </div>
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
  gridColumns?: number | "auto" | "default";
}

function Row({ children, className, gridColumns = "default" }: HeaderProps) {
  let gridColumnsCount = gridColumns;
  if (gridColumns === "default") {
    gridColumnsCount = 10;
  } else if (gridColumns === "auto") {
    gridColumnsCount = (Children.count(children) - 2) * 2 + 2;
  }

  return (
    <div
      className={classNames(
        "p-4 grid gap-2 bg-light-surfaceContainerLowest h-[72px] items-center border-b border-neutral-300",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${gridColumnsCount}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
  gridColumns?: HeaderProps["gridColumns"];
}

function Header({ children, className, gridColumns }: HeaderProps) {
  return (
    <Row
      className={classNames(
        "bg-light-tertiaryContainer rounded-t-md border-none",
        className
      )}
      gridColumns={gridColumns}
    >
      {children}
    </Row>
  );
}

interface CellProps {
  label?: string;
  className?: string;
  colSpan?: number;
}

function Cell({ label, className, colSpan }: CellProps) {
  const colSpanAux = colSpan ?? 2;

  return (
    <span
      className={classNames(
        "text-light-onTertiaryContainer text-body-medium overflow-x-hidden",
        className,
        {
          "first:!col-span-1": !colSpan,
        }
      )}
      style={{
        gridColumn: `span ${colSpanAux} / span ${colSpanAux}`,
      }}
    >
      {label}
    </span>
  );
}

interface ActionProps {
  className?: string;
  colSpan?: number;
  children: ReactNode;
}

function Action({ className, colSpan = 1, children }: ActionProps) {
  return (
    <div
      className={classNames("overflow-x-hidden flex justify-end", className)}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
      }}
    >
      <Popover>
        <Popover.Trigger>
          <Button variant="tertiary" iconRight={<MoreHorizIcon />} />
        </Popover.Trigger>
        <Popover.Content align="end" className="w-fit">{children}</Popover.Content>
      </Popover>
    </div>
  );
}

interface HeadProps {
  label?: string;
  className?: string;
  action?: boolean;
  colSpan?: CellProps["colSpan"];
}

function Head({ label, className, action = false, colSpan }: HeadProps) {
  return (
    <Cell
      className={classNames("!text-body-large", className, {
        "!col-span-1": action,
      })}
      label={label}
      colSpan={colSpan}
    />
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
  itemsCurrentPage?: number;
}

function Footer({
  className,
  currentStartItem,
  itemsCurrentPage,
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
        "bg-light-tertiaryContainer rounded-b-md border-none !flex items-center gap-4 justify-end",
        className
      )}
      gridColumns={1}
    >
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
          {itemsCurrentPage && `-${itemsCurrentPage}`}
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
    </Row>
  );
}

interface FilterProps {
  onFilterCallback: () => void;
  filterBtnState?: ComponentProps<typeof Button>["state"];
  formComponent: ReactNode;
}

function Filter({
  onFilterCallback,
  filterBtnState,
  formComponent,
}: FilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <SideSheet open={open} onOpenChange={setOpen}>
        <SideSheet.Trigger>
          <Button
            variant="secondary"
            label="Filtros"
            iconRight={<FilterListIcon />}
            onClick={onFilterCallback}
            state={filterBtnState}
          />
        </SideSheet.Trigger>
        <SideSheet.Content>
          <SideSheet.Header label="Filtros" />
          <SideSheet.Body>{formComponent}</SideSheet.Body>
          <SideSheet.Footer
            primaryLabel="Aplicar"
            secondaryLabel="Limpar"
            onSecondaryCallback={() => setOpen(false)}
            onPrimaryCallback={() => setOpen(false)}
          />
        </SideSheet.Content>
      </SideSheet>
    </div>
  );
}

const Table = Object.assign(Container, {
  Row,
  Cell,
  Header,
  Head,
  Body,
  Footer,
  Filter,
  Action,
});

export default Table;
