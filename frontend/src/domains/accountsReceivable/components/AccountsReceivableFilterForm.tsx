import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import SideSheet from "@/design-system/SideSheet";
import { memo, ReactElement, ReactNode } from "react";
import { accountReceivableFilterDefaultValues } from "../constants";
import { useFormContext } from "react-hook-form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { AccountsReceivableFilterFormInputs } from "../types";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import { SchemaAccountsReceivableFilterForm } from "../schemas";
import InputLabel from "@/design-system/Form/InputLabel";
import Choice from "@/design-system/Form/Choice";
import { InstallmentStatus } from "@shared/enums";

function AccountsReceivableFilterForm(): ReactNode {
  const { accountsReceivableFilter, handleAccountsReceivableFilter } =
    useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleSubmit(data: AccountsReceivableFilterFormInputs) {
    handleAccountsReceivableFilter({ page: 1, ...data });
    closeDialog();
  }

  return (
    <Form<AccountsReceivableFilterFormInputs>
      schema={SchemaAccountsReceivableFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col"
      defaultValues={{
        startDate: accountsReceivableFilter?.startDate || "",
        endDate: accountsReceivableFilter?.endDate || "",
        overallStatus: accountsReceivableFilter?.overallStatus || InstallmentStatus.PAID,
      }}
      replaceEmptyStringToNull={false}
    >
      <AccountsReceivableFilterFormContent />
    </Form>
  );
}

function AccountsReceivableFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleAccountsReceivableFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleAccountsReceivableFilter(accountReceivableFilterDefaultValues);
    reset(accountReceivableFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <Input<AccountsReceivableFilterFormInputs>
          name="startDate"
          label="Data inicial"
          type="date"
        />
        <Input<AccountsReceivableFilterFormInputs>
          name="endDate"
          label="Data final"
          type="date"
        />
        <InputLabel label="Status geral" />
        <div className="flex flex-col gap-2">
          <Choice hideErrorLabel>
            <Choice.Radio<AccountsReceivableFilterFormInputs>
              name="overallStatus"
              label="Pago"
              value={InstallmentStatus.PAID}
            />
            <Choice.Radio<AccountsReceivableFilterFormInputs>
              name="overallStatus"
              label="Pendente"
              value={InstallmentStatus.PENDING}
            />
          </Choice>
        </div>
      </SideSheet.Body>
      <SideSheet.Footer
        primaryLabel="Aplicar"
        secondaryLabel="Limpar"
        onSecondaryCallback={handleReset}
        dirty
      />
    </>
  );
}

export default memo(AccountsReceivableFilterForm);
