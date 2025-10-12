import Spinner from "@/design-system/Spinner";
import useCheckPermission from "@/domains/global/hooks/useCheckPermission";
import useDialog from "@/domains/global/hooks/useDialog";
import { Childrenable } from "@/domains/global/types";
import { ITEMS_PER_PAGE } from "@shared/constants";
import { ActionsType, ResourcesType } from "@shared/enums";
import { formatDeniedMessage } from "@shared/utils/formatDeniedMessage";
import classNames from "classnames";
import { Children, type ReactElement, type ReactNode } from "react";
import Button from "./Button";
import Loading from "./Loading";
import SideSheet from "./SideSheet";
import { ButtonState } from "./types";

function Container({ children }: Childrenable): ReactElement {
  return (
    <div className="overflow-x-auto flex flex-1">
      <div className="w-full flex flex-col">{children}</div>
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
    gridColumnsCount = 11;
  } else if (gridColumns === "auto") {
    gridColumnsCount = (Children.count(children) - 2) * 2 + 2;
  }

  return (
    <div
      className={classNames(
        "px-4 py-4 flex-col flex gap-2 bg-neutral-50 border-b border-neutral-300 border-r",
        "xl:py-1 xl:grid xl:h-14 xl:items-center",
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
        "bg-neutral-50 border border-neutral-300 rounded-t-md xl:block hidden",
        className
      )}
      gridColumns={gridColumns}
    >
      {children}
    </Row>
  );
}

interface CellProps {
  id?: string;
  className?: string;
  colSpan?: number;
  label?: ReactNode;
  columnLabel?: string;
}

function Cell({ id, label, className, colSpan, columnLabel }: CellProps) {
  const colSpanAux = colSpan ?? 2;

  return (
    <span
      className="text-neutral-700 text-body-medium overflow-x-hidden"
      style={{
        gridColumn: `span ${colSpanAux} / span ${colSpanAux}`,
      }}
    >
      <span className="font-semibold xl:hidden">{columnLabel}: </span>
      <span className={className} data-cy={`${columnLabel}-${id}`}>
        {label}
      </span>
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
      className={classNames(
        "overflow-x-hidden flex gap-2 xl:justify-end",
        className
      )}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
      }}
    >
      {children}
    </div>
  );
}

interface HeadProps extends CellProps {
  action?: boolean;
}

function Head({ label, className, action = false, colSpan }: HeadProps) {
  return (
    <Cell
      className={classNames("!text-body-large", className)}
      label={label}
      colSpan={action ? 1 : colSpan}
    />
  );
}

interface BodyProps extends Childrenable {
  isEmpty?: boolean;
  isLoading?: boolean;
  resource?: ResourcesType;
  action?: ActionsType;
}

function Body({ children, isEmpty, isLoading, action, resource }: BodyProps) {
  const hasPermission = useCheckPermission(resource, action);

  if (isLoading || isEmpty) {
    return (
      <div className="flex-1 bg-neutral-50 overflow-y-auto flex items-center justify-center border xl:border-t-0 rounded-md xl:rounded-t-none border-neutral-300">
        {isLoading ? (
          <Spinner />
        ) : (
          <span className="text-neutral-700 text-body-medium">
            {hasPermission
              ? "Nenhum item encontrado"
              : formatDeniedMessage({ resource, action })}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-neutral-50 border xl:border-t-0 rounded-md xl:rounded-t-none border-neutral-300 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:block">
      {children}
    </div>
  );
}

interface FooterProps {
  className?: string;
  currentStartItem?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onClickNavigateBtn?: (page: number) => void;
  isLoading?: boolean;
}

function Footer({
  className,
  currentStartItem = 1,
  itemsPerPage = ITEMS_PER_PAGE,
  totalItems,
  onClickNavigateBtn,
  isLoading,
}: FooterProps) {
  const pageOffset = (currentStartItem - 1) * itemsPerPage; // 0, 20, 40 etc.

  const lastPage = totalItems && totalItems <= pageOffset + itemsPerPage; // 21-30 of 30 or 21-40 of 40

  function handleNext() {
    if (onClickNavigateBtn) {
      onClickNavigateBtn(lastPage ? currentStartItem : currentStartItem + 1); // Don't allow to navigate to next page if it's the last one
    }
  }

  function handleBefore() {
    if (onClickNavigateBtn) {
      onClickNavigateBtn(currentStartItem === 1 ? 1 : currentStartItem - 1); // Don't allow to navigate to previous page if it's the first one
    }
  }

  return (
    <Row
      className={classNames(
        "bg-neutral-50 rounded-b-md border-none !flex items-center gap-4 justify-center !flex-row",
        className
      )}
      gridColumns={1}
    >
      <Button
        variant="quaternary"
        iconLeft="NavigateBefore"
        onClick={handleBefore}
        label="Anterior"
        data-cy="table-navigate-before"
        tooltipMessage="Página anterior"
        state={
          isLoading
            ? "loading"
            : currentStartItem === 1
            ? "disabled"
            : undefined
        }
      />
      <Loading
        isLoading={!!isLoading}
        className="text-neutral-700 text-body-large"
      >
        {totalItems ? (
          <>
            {`${pageOffset + 1}`}
            {`-${lastPage ? totalItems : pageOffset + itemsPerPage}`}
            {` de ${totalItems}`}
          </>
        ) : (
          "-"
        )}
      </Loading>
      <Button
        variant="quaternary"
        iconRight="NavigateNext"
        onClick={handleNext}
        label="Próxima"
        tooltipMessage="Página seguinte"
        data-cy="table-navigate-next"
        state={
          isLoading
            ? "loading"
            : lastPage || !totalItems
            ? "disabled"
            : undefined
        }
      />
    </Row>
  );
}

interface FilterProps {
  onFilterCallback?: () => void;
  filterBtnState?: ButtonState;
  form: ReactNode;
}

function Filter({ onFilterCallback, filterBtnState, form }: FilterProps) {
  const dialog = useDialog();

  return (
    <SideSheet {...dialog}>
      <SideSheet.Trigger>
        <div className="flex justify-end">
          <Button
            variant="secondary"
            label="Filtros"
            iconRight="FilterList"
            onClick={onFilterCallback}
            state={filterBtnState}
            data-cy="button-table-filter"
            tooltipMessage="Abrir filtros"
          />
        </div>
      </SideSheet.Trigger>
      <SideSheet.Content>
        <SideSheet.Header label="Filtros" />
        {form}
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
