import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export type Transaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
> & {
  rollback: () => void;
};

export type GetCallback = (
  entityWhereUniqueInput: Partial<Record<'OR', Record<string, string>[]>>,
  select: { id: boolean },
  onlyActive: boolean,
  showNotFoundError: boolean,
) => Promise<{ id: string } | null>;
