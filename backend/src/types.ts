import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export type Transaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
> & {
  rollback: () => void;
};

export type Transactionable = {
  transaction?: Transaction;
};

interface GetCallbackInput {
  where: Partial<Record<'OR', Record<string, string>[]>>;
  select: { id: boolean };
  onlyActive: boolean;
  showNotFoundError: boolean;
}

export type GetCallback = (
  _: GetCallbackInput,
) => Promise<{ id: string } | null>;

export interface EncryptPasswordInput {
  password: string;
}

export type CreateInput<T> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'archivedAt'
>;
export type UpdateInput<T> = Partial<CreateInput<T>>;
