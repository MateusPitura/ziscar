export type Resource = "USERS";

export type Action = "CREATE" | "READ" | "UPDATE" | "DELETE";

export type Permissions = Record<Resource, Record<Action, boolean>>;
