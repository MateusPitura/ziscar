import {
  Resources,
  Actions,
  VEHICLESTATUS_VALUES,
  VehicleStatus,
} from "./enums";

export type Permissions = Record<Resources, Record<Actions, boolean>>;

export const VEHICLE_INACTIVE_STATUS = "INACTIVE";

export const VehicleStatusForFilter = [
  ...VEHICLESTATUS_VALUES.filter((status) => status !== VehicleStatus.SOLD),
  VEHICLE_INACTIVE_STATUS,
];

export type VehicleStatusForFilterType =
  (typeof VehicleStatusForFilter)[number];
