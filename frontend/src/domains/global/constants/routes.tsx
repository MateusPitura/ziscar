import { IconsName } from "@/design-system/types";
import { ActionsType, ResourcesType } from "@shared/enums";
import { lazy, ReactNode } from "react";
import { DEFAULT_ROUTE } from ".";

interface Route {
  path: string;
  displayName?: string;
  icon?: IconsName;
  entryPage: ReactNode;
  shouldDisplay: boolean;
  resource?: ResourcesType;
  action?: ActionsType;
}

const Vehicles = lazy(
  () => import("@/domains/vehicles/components/VehiclesPage")
);
const NewVehicle = lazy(
  () => import("@/domains/vehicles/components/NewVehiclePage")
);
const EditVehicle = lazy(
  () => import("@/domains/vehicles/components/EditVehiclePage")
);
const VehicleExpense = lazy(
  () => import("@/domains/vehicles/components/VehicleExpensePage")
);
const NewVehicleExpense = lazy(
  () => import("@/domains/vehicles/components/NewVehicleExpensePage")
);
const EditVehicleExpense = lazy(
  () => import("@/domains/vehicles/components/EditVehicleExpensePage")
);

const Users = lazy(() => import("@/domains/users/components/UsersPage"));
const NewUser = lazy(() => import("@/domains/users/components/NewUserPage"));
const EditUser = lazy(() => import("@/domains/users/components/EditUserPage"));

const EditProfile = lazy(
  () => import("@/domains/profile/components/EditProfilePage")
);

const Stores = lazy(() => import("@/domains/stores/components/StoresPage"));
const NewStore = lazy(() => import("@/domains/stores/components/NewStorePage"));
const EditStore = lazy(
  () => import("@/domains/stores/components/EditStorePage")
);

const Customers = lazy(
  () => import("@/domains/customers/components/CustomersPage")
);
const NewCustomer = lazy(
  () => import("@/domains/customers/components/NewCustomerPage")
);
const EditCustomer = lazy(
  () => import("@/domains/customers/components/EditCustomerPage")
);

const VehicleSale = lazy(
  () => import("@/domains/vehicleSale/components/VehicleSalePage")
);
const ViewVehicleSale = lazy(
  () => import("@/domains/vehicleSale/components/ViewVehicleSalePage")
);

const NotFound = lazy(() => import("@/domains/global/components/NotFoundPage"));

const Sign = lazy(() => import("@/domains/sign/components/SignPage"));

const AccountsPayable = lazy(
  () => import("@/domains/accountsPayable/components/AccountsPayablePage")
);
const AccountsPayableInstallments = lazy(
  () =>
    import(
      "@/domains/accountsPayable/components/AccountsPayableInstallmentsPage"
    )
);

const AccountsReceivable = lazy(
  () => import("@/domains/accountsReceivable/components/AccountsReceivablePage")
);
const AccountsReceivableInstallments = lazy(
  () =>
    import(
      "@/domains/accountsReceivable/components/AccountsReceivableInstallmentsPage"
    )
);

const VehiclesContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/VehiclesContextHelper")
);
const NewVehicleContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/NewVehicleContextHelper")
);
const EditVehicleContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/EditVehicleContextHelper")
);
const VehicleExpenseContextHelper = lazy(
  () =>
    import("@/domains/contextHelpers/components/VehicleExpenseContextHelper")
);
const NewVehicleExpenseContextHelper = lazy(
  () =>
    import("@/domains/contextHelpers/components/NewVehicleExpenseContextHelper")
);
const EditVehicleExpenseContextHelper = lazy(
  () =>
    import(
      "@/domains/contextHelpers/components/EditVehicleExpenseContextHelper"
    )
);
const UsersContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/UsersContextHelper")
);
const NewUserContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/NewUserContextHelper")
);
const EditUserContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/EditUserContextHelper")
);
const EditProfileContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/EditProfileContextHelper")
);
const StoresContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/StoresContextHelper")
);
const NewStoreContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/NewStoreContextHelper")
);
const EditStoreContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/EditStoreContextHelper")
);
const CustomersContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/CustomersContextHelper")
);
const NewCustomerContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/NewCustomerContextHelper")
);
const EditCustomerContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/EditCustomerContextHelper")
);
const VehicleSaleContextHelper = lazy(
  () => import("@/domains/contextHelpers/components/VehicleSaleContextHelper")
);
const ViewVehicleSaleContextHelper = lazy(
  () =>
    import("@/domains/contextHelpers/components/ViewVehicleSaleContextHelper")
);
const AccountsPayableContextHelper = lazy(
  () =>
    import("@/domains/contextHelpers/components/AccountsPayableContextHelper")
);
const AccountsPayableInstallmentsContextHelper = lazy(
  () =>
    import(
      "@/domains/contextHelpers/components/AccountsPayableInstallmentsContextHelper"
    )
);
const AccountsReceivableContextHelper = lazy(
  () =>
    import(
      "@/domains/contextHelpers/components/AccountsReceivableContextHelper"
    )
);
const AccountsReceivableInstallmentsContextHelper = lazy(
  () =>
    import(
      "@/domains/contextHelpers/components/AccountsReceivableInstallmentsContextHelper"
    )
);

export const privateRoutes: Route[] = [
  {
    path: DEFAULT_ROUTE,
    displayName: "Veículos",
    icon: "DirectionsCar",
    entryPage: <Vehicles contextHelper={<VehiclesContextHelper />} />,
    shouldDisplay: true,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/new",
    entryPage: <NewVehicle contextHelper={<NewVehicleContextHelper />} />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/edit/:vehicleId",
    entryPage: <EditVehicle contextHelper={<EditVehicleContextHelper />} />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/expense/:vehicleId",
    entryPage: (
      <VehicleExpense contextHelper={<VehicleExpenseContextHelper />} />
    ),
    shouldDisplay: false,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/expense/:vehicleId/new",
    entryPage: (
      <NewVehicleExpense contextHelper={<NewVehicleExpenseContextHelper />} />
    ),
    shouldDisplay: false,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/expense/:vehicleId/edit/:expenseId",
    entryPage: (
      <EditVehicleExpense contextHelper={<EditVehicleExpenseContextHelper />} />
    ),
    shouldDisplay: false,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/vehicle-sale/new/:vehicleId",
    entryPage: <VehicleSale contextHelper={<VehicleSaleContextHelper />} />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "VEHICLE_SALE",
  },
  {
    path: "/vehicle-sale/view/:vehicleSaleId",
    entryPage: (
      <ViewVehicleSale contextHelper={<ViewVehicleSaleContextHelper />} />
    ),
    shouldDisplay: false,
    action: "READ",
    resource: "VEHICLE_SALE",
  },
  {
    path: "/accounts-receivable",
    displayName: "Vendas",
    icon: "CreditCard",
    entryPage: (
      <AccountsReceivable contextHelper={<AccountsReceivableContextHelper />} />
    ),
    shouldDisplay: true,
    action: "READ",
    resource: "ACCOUNTS_RECEIVABLE",
  },
  {
    path: "/accounts-receivable/:accountReceivableId/installments",
    entryPage: (
      <AccountsReceivableInstallments
        contextHelper={<AccountsReceivableInstallmentsContextHelper />}
      />
    ),
    shouldDisplay: false,
    action: "READ",
    resource: "ACCOUNTS_RECEIVABLE",
  },
  {
    path: "/accounts-payable",
    displayName: "Pagamentos",
    icon: "CreditCardOff",
    entryPage: (
      <AccountsPayable contextHelper={<AccountsPayableContextHelper />} />
    ),
    shouldDisplay: true,
    action: "READ",
    resource: "ACCOUNTS_PAYABLE",
  },
  {
    path: "/accounts-payable/:accountPayableId/installments",
    entryPage: (
      <AccountsPayableInstallments
        contextHelper={<AccountsPayableInstallmentsContextHelper />}
      />
    ),
    shouldDisplay: false,
    action: "READ",
    resource: "ACCOUNTS_PAYABLE",
  },
  {
    path: "/stores",
    displayName: "Lojas",
    icon: "Store",
    entryPage: <Stores contextHelper={<StoresContextHelper />} />,
    shouldDisplay: true,
    action: "READ",
    resource: "STORES",
  },
  {
    path: "/stores/new",
    entryPage: <NewStore contextHelper={<NewStoreContextHelper />} />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "STORES",
  },
  {
    path: "/stores/edit/:storeId",
    entryPage: <EditStore contextHelper={<EditStoreContextHelper />} />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "STORES",
  },
  {
    path: "/users",
    displayName: "Usuários",
    icon: "Person",
    entryPage: <Users contextHelper={<UsersContextHelper />} />,
    shouldDisplay: true,
    action: "READ",
    resource: "USERS",
  },
  {
    path: "/users/new",
    entryPage: <NewUser contextHelper={<NewUserContextHelper />} />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "USERS",
  },
  {
    path: "/users/edit/:userId",
    entryPage: <EditUser contextHelper={<EditUserContextHelper />} />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "USERS",
  },
  {
    path: "/customers",
    displayName: "Clientes",
    icon: "People",
    entryPage: <Customers contextHelper={<CustomersContextHelper />} />,
    shouldDisplay: true,
    action: "READ",
    resource: "CUSTOMERS",
  },
  {
    path: "/customers/new",
    entryPage: <NewCustomer contextHelper={<NewCustomerContextHelper />} />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "CUSTOMERS",
  },
  {
    path: "/customers/edit/:customerId",
    entryPage: <EditCustomer contextHelper={<EditCustomerContextHelper />} />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "CUSTOMERS",
  },
  {
    path: "/profile",
    entryPage: <EditProfile contextHelper={<EditProfileContextHelper />} />,
    shouldDisplay: true,
    icon: "Settings",
    displayName: "Conta",
  },
];

export const publicRoutes: Route[] = [
  {
    path: "/",
    entryPage: <Sign />,
    shouldDisplay: false,
  },
  {
    path: "/new-account",
    entryPage: <Sign />,
    shouldDisplay: false,
  },
  {
    path: "*",
    entryPage: <NotFound />,
    shouldDisplay: false,
  },
];
