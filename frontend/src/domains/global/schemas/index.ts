import { s } from "@shared/safeZod";

export const SchemaAddress = s.SchemaAddress.extend({
  street: s.string().or(s.empty()),
  neighborhood: s.string().or(s.empty()),
  cityIbgeCode: s.string().or(s.empty()),
  state: s.string().or(s.empty()),
});
