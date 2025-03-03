import { s } from '@shared/safeZod';

export const SchemaParam = s.object({
  id: s.id(),
});

export type ParamInputs = s.infer<typeof SchemaParam>;
