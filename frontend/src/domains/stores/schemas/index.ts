import { s } from "@shared/safeZod";

export const SchemaStoresFilterForm = s.object({
    name: s.string().or(s.empty()),
    orderBy: s.radio(["name", "email"]),
    status: s.radio(["active", "inactive"]),
})