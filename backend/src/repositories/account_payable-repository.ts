import { AccountPayable } from '@prisma/client';
import { CreateInput, UpdateInput } from 'src/types';

export interface SearchResponse {
  total: number;
  data: {
    id: number;
    description: string;
    paidTo: string;
    totalValue: number;
    overallStatus: 'PAID' | 'PENDING';
  }[];
}

export abstract class AccountPayableRepository {
  abstract create(data: CreateInput<AccountPayable>): Promise<AccountPayable>;
  abstract findById(id: string): Promise<AccountPayable | null>;
  abstract search(
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
    overallStatus: 'PENDING' | 'PAID',
    totalValue: string): Promise<SearchResponse>;
  abstract update(id: string, data: UpdateInput<AccountPayable>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
