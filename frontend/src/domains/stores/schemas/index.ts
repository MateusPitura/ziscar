import { SchemaAddress } from "@/domains/global/schemas";
import { s } from "@shared/safeZod";

export const SchemaStoresFilterForm = s.object({
    name: s.string().or(s.empty()),
    orderBy: s.radio(["name", "email"]),
    status: s.radio(["active", "inactive"]),
})

export const SchemaStoreForm = s.object({
    name: s.string(),
    email: s.email().or(s.empty()),
    phone: s.phone().or(s.empty()),
    cnpj: s.cnpj(),
    address: s.array(SchemaAddress).max(1),
})