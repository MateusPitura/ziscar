import { Resources, Actions } from "./enums";

export type Permissions = Record<Resources, Record<Actions, boolean>>;

export enum ActivityStatus {
  ALL = "ALL",
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
}
