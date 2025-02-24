import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Transaction } from 'src/types';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async transaction<T>(
    actions: (tx: Transaction) => Promise<T>,
  ): Promise<void> {
    try {
      await this.$transaction(
        async (prisma) => {
          const enhancedTx = {
            ...prisma,
            rollback: () => {
              throw new Error('Transaction roll back');
            },
          };

          const result = await actions(enhancedTx);

          return result;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (error instanceof Error && error.message !== 'Transaction roll back') {
        throw error;
      }
    }
  }
}
