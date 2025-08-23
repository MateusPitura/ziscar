import { BRAZILIANSTATE_VALUES } from "@shared/enums";
import { s } from "@shared/safeZod";
import { FieldValues, Path } from "react-hook-form";

export const SchemaAddress = s.SchemaAddress.extend({
  street: s.string().or(s.empty()),
  neighborhood: s.string().or(s.empty()),
  cityIbgeCode: s.string().or(s.empty()),
  state: s.enumeration(BRAZILIANSTATE_VALUES).or(s.empty()),
});

export function addIssue<T extends FieldValues>(
  ctx: s.RefinementCtx,
  path: Path<T>
) {
  ctx.addIssue({
    code: "custom",
    message: "Campo obrigatório",
    path: path.split("."),
  });
}
