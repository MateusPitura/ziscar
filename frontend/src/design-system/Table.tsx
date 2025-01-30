import classNames from "classnames";
import {
  Children,
  Dispatch,
  SetStateAction,
  type ReactElement,
  type ReactNode,
} from "react";
import Button, { ButtonState } from "./Button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import Spinner from "@/design-system/Spinner";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Popover } from "./Popover";
import SideSheet from "./SideSheet";
import { CustomFormProvider } from "@/domains/global/contexts/CustomFormContext";
import { Childrenable } from "@/domains/global/types/components";
import useDialog from "@/domains/profile/hooks/useDialog";
import { ITEMS_PER_PAGE } from "@/domains/global/constants/requests";

function Container({ children }: Childrenable): ReactElement {
  return (
    <div className="overflow-x-auto flex flex-1">
      <div className="min-w-[50rem] w-full flex flex-col">{children}</div>
    </div>
  );
}

interface RowProps extends Childrenable {
  className?: string;
  gridColumns?: number | "auto" | "default";
}

function Row({ children, className, gridColumns = "default" }: RowProps) {
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

type HeaderProps = RowProps;

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
  className?: string;
  colSpan?: number;
  label?: string;
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

interface ActionProps extends Childrenable {
  className?: string;
  colSpan?: number;
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
        <Popover.Content align="end" className="w-fit">
          {children}
        </Popover.Content>
      </Popover>
    </div>
  );
}

interface HeadProps extends CellProps {
  action?: boolean;
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

interface BodyProps extends Childrenable {
  isEmpty?: boolean;
  isLoading?: boolean;
}

function Body({ children, isEmpty, isLoading }: BodyProps) {
  if (isLoading || isEmpty) {
    return (
      <div className="flex-1 bg-light-surfaceContainerLowest overflow-y-auto flex items-center justify-center">
        {isLoading ? (
          <Spinner />
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
  exportSpreadSheetBtnState?: ButtonState;
  onExportPdfCallback?: () => void;
  exportPdfBtnState?: ButtonState;
  onNavigateCallback?: Dispatch<SetStateAction<number>>;
  navBeforeBtnState?: ButtonState;
  navNextBtnState?: ButtonState;
  currentStartItem?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

function Footer({
  className,
  currentStartItem = 1,
  itemsPerPage = ITEMS_PER_PAGE,
  onExportPdfCallback,
  onExportSpreadSheetCallback,
  onNavigateCallback,
  totalItems,
  exportPdfBtnState,
  exportSpreadSheetBtnState,
  navBeforeBtnState,
  navNextBtnState,
}: FooterProps) {
  const pageOffset = (currentStartItem - 1) * itemsPerPage; // 0, 20, 40 etc.

  const lastPage =
    (totalItems && totalItems < pageOffset + itemsPerPage) || // 21-30 de 30
    pageOffset + itemsPerPage === totalItems; // 21-40 de 40

  function handleNext() {
    if (onNavigateCallback) {
      onNavigateCallback((prev) => (lastPage ? prev : prev + 1)); // Don't allow to navigate to next page if it's the last one
    }
  }

  function handleBefore() {
    if (onNavigateCallback) {
      onNavigateCallback((prev) => (prev === 1 ? 1 : prev - 1)); // Don't allow to navigate to previous page if it's the first one  
    }
  }

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
      {currentStartItem && totalItems && itemsPerPage && (
        <div>
          <span className="text-light-onTertiaryContainer text-body-large">
            {`${pageOffset + 1}`}
            {`-${lastPage ? totalItems : pageOffset + itemsPerPage}`}
            {` de ${totalItems}`}
          </span>
        </div>
      )}
      <Button
        variant="tertiary"
        iconLeft={<NavigateBeforeOutlinedIcon />}
        onClick={handleBefore}
        state={
          navBeforeBtnState || currentStartItem === 1 ? "disabled" : undefined
        }
      />
      <Button
        variant="tertiary"
        iconLeft={<NavigateNextOutlinedIcon />}
        onClick={handleNext}
        state={navNextBtnState || lastPage ? "disabled" : undefined}
      />
    </Row>
  );
}

interface FilterProps {
  onFilterCallback?: () => void;
  filterBtnState?: ButtonState;
  formComponent: ReactNode;
}

function Filter(props: FilterProps) {
  return (
    <CustomFormProvider>
      <FilterContent {...props} />
    </CustomFormProvider>
  );
}

type FilterContentProps = FilterProps;

function FilterContent({
  onFilterCallback,
  filterBtnState,
  formComponent,
}: FilterContentProps) {
  const { isOpen, handleOpen } = useDialog();

  return (
    <SideSheet open={isOpen} onOpenChange={handleOpen}>
      <SideSheet.Trigger>
        <div className="flex justify-end">
          <Button
            variant="secondary"
            label="Filtros"
            iconRight={<FilterListIcon />}
            onClick={onFilterCallback}
            state={filterBtnState}
          />
        </div>
      </SideSheet.Trigger>
      <SideSheet.Content>
        <SideSheet.Header label="Filtros" />
        {formComponent}
      </SideSheet.Content>
    </SideSheet>
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
