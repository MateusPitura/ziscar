import { Resources, Actions } from "./enums";

export type Permissions = Record<Resources, Record<Actions, boolean>>;
