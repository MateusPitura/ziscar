import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import InputLabel from "@/design-system/Form/InputLabel";
import SideSheet from "@/design-system/SideSheet";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import { InstallmentStatus } from "@shared/enums";
import { memo, ReactElement, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { accountPayableFilterDefaultValues } from "../constants";
import { SchemaAccountsPayableFilterForm } from "../schemas";
import { AccountsPayableFilterFormInputs } from "../types";

function AccountsPayableFilterForm(): ReactNode {
  const { accountsPayableFilter, handleAccountsPayableFilter } =
    useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleSubmit(data: AccountsPayableFilterFormInputs) {
    handleAccountsPayableFilter({ page: 1, ...data });
    closeDialog();
  }

  return (
    <Form<AccountsPayableFilterFormInputs>
      schema={SchemaAccountsPayableFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col min-h-0"
      defaultValues={{
        startDate: accountsPayableFilter?.startDate || "",
        endDate: accountsPayableFilter?.endDate || "",
        description: accountsPayableFilter?.description || "",
        overallStatus:
          accountsPayableFilter?.overallStatus || InstallmentStatus.PAID,
      }}
      replaceEmptyStringToNull={false}
    >
      <AccountsPayableFilterFormContent />
    </Form>
  );
}

function AccountsPayableFilterFormContent(): ReactElement {
  const { reset } = useFormContext();
  const { handleAccountsPayableFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleAccountsPayableFilter(accountPayableFilterDefaultValues);
    reset(accountPayableFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4">
        <Input<AccountsPayableFilterFormInputs>
          label="Descrição"
          name="description"
        />
        <Input<AccountsPayableFilterFormInputs>
          name="startDate"
          label="Data inicial de criação"
          type="date"
        />
        <Input<AccountsPayableFilterFormInputs>
          name="endDate"
          label="Data final de criação"
          type="date"
        />
        <InputLabel label="Status geral" />
        <div className="flex flex-col gap-2">
          <Choice hideErrorLabel>
            <Choice.Radio<AccountsPayableFilterFormInputs>
              name="overallStatus"
              label="Pago"
              value={InstallmentStatus.PAID}
            />
            <Choice.Radio<AccountsPayableFilterFormInputs>
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

export default memo(AccountsPayableFilterForm);
