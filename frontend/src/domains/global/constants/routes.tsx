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

export const privateRoutes: Route[] = [
  {
    path: DEFAULT_ROUTE,
    displayName: "Veículos",
    icon: "DirectionsCar",
    entryPage: <Vehicles />,
    shouldDisplay: true,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/new",
    entryPage: <NewVehicle />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/edit/:vehicleId",
    entryPage: <EditVehicle />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/expense/:vehicleId",
    entryPage: <VehicleExpense />,
    shouldDisplay: false,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/expense/:vehicleId/new",
    entryPage: <NewVehicleExpense />,
    shouldDisplay: false,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/vehicles/expense/:vehicleId/edit/:expenseId",
    entryPage: <EditVehicleExpense />,
    shouldDisplay: false,
    action: "READ",
    resource: "VEHICLES",
  },
  {
    path: "/vehicle-sale/new/:vehicleId",
    entryPage: <VehicleSale />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "VEHICLE_SALE",
  },
  {
    path: "/vehicle-sale/view/:vehicleSaleId",
    entryPage: <ViewVehicleSale />,
    shouldDisplay: false,
    action: "READ",
    resource: "VEHICLE_SALE",
  },
  {
    path: "/accounts-receivable",
    displayName: "Vendas",
    icon: "CreditCard",
    entryPage: <AccountsReceivable />,
    shouldDisplay: true,
    action: "READ",
    resource: "ACCOUNTS_RECEIVABLE",
  },
  {
    path: "/accounts-receivable/:accountReceivableId/installments",
    entryPage: <AccountsReceivableInstallments />,
    shouldDisplay: false,
    action: "READ",
    resource: "ACCOUNTS_RECEIVABLE",
  },
  {
    path: "/accounts-payable",
    displayName: "Pagamentos",
    icon: "CreditCardOff",
    entryPage: <AccountsPayable />,
    shouldDisplay: true,
    action: "READ",
    resource: "ACCOUNTS_PAYABLE",
  },
  {
    path: "/accounts-payable/:accountPayableId/installments",
    entryPage: <AccountsPayableInstallments />,
    shouldDisplay: false,
    action: "READ",
    resource: "ACCOUNTS_PAYABLE",
  },
  {
    path: "/stores",
    displayName: "Lojas",
    icon: "Store",
    entryPage: <Stores />,
    shouldDisplay: true,
    action: "READ",
    resource: "STORES",
  },
  {
    path: "/stores/new",
    entryPage: <NewStore />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "STORES",
  },
  {
    path: "/stores/edit/:storeId",
    entryPage: <EditStore />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "STORES",
  },
  {
    path: "/users",
    displayName: "Usuários",
    icon: "Person",
    entryPage: <Users />,
    shouldDisplay: true,
    action: "READ",
    resource: "USERS",
  },
  {
    path: "/users/new",
    entryPage: <NewUser />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "USERS",
  },
  {
    path: "/users/edit/:userId",
    entryPage: <EditUser />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "USERS",
  },
  {
    path: "/customers",
    displayName: "Clientes",
    icon: "People",
    entryPage: <Customers />,
    shouldDisplay: true,
    action: "READ",
    resource: "CUSTOMERS",
  },
  {
    path: "/customers/new",
    entryPage: <NewCustomer />,
    shouldDisplay: false,
    action: "CREATE",
    resource: "CUSTOMERS",
  },
  {
    path: "/customers/edit/:customerId",
    entryPage: <EditCustomer />,
    shouldDisplay: false,
    action: "UPDATE",
    resource: "CUSTOMERS",
  },
  {
    path: "/profile",
    entryPage: <EditProfile />,
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
