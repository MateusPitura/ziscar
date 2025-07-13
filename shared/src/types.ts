export type Resource =
  | "USERS"
  | "VEHICLES"
  | "STORES"
  | "VEHICLE_PURCHASE"
  | "VEHICLE_EXPENSE"
  | "VEHICLE_SALE"
  | "ACCOUNTS_PAYABLE"
  | "ACCOUNTS_RECEIVABLE"
  | "CUSTOMERS";

export type Action = "CREATE" | "READ" | "UPDATE" | "DELETE";

export type Permissions = Record<Resource, Record<Action, boolean>>;
