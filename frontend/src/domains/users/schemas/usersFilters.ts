import { z } from "zod";

export const SchemaUsersFilterForm = z.object({
  name: z.string().optional(),
  orderBy: z.string().optional(),
  category: z.string().array().optional(),
});

export type UsersFilterFormInputs = z.infer<typeof SchemaUsersFilterForm>;
