import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Transaction } from 'src/types';

const MAX_RETRIES = 3;

interface Error {
  code?: string;
  message?: string;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async transaction(actions: (tx: Transaction) => unknown): Promise<void> {
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        await this.$transaction(
          async (prisma) => {
            const enhancedTx = {
              ...prisma,
              rollback: () => {
                throw new Error('ROLLBACK');
              },
            };

            await actions(enhancedTx);
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );
        break;
      } catch (error) {
        if ((error as Error)?.code === 'P2034') {
          retries++;
          continue;
        }
        if ((error as Error)?.message === 'ROLLBACK') {
          break;
        }
        throw error;
      }
    }

    if (retries >= MAX_RETRIES) {
      throw new Error('Transaction failed after maximum retries');
    }
  }
}
