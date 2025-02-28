import { ConflictException } from '@nestjs/common';
import { GetCallback, Transaction } from '../types';

export async function verifyDuplicated(
  properties: Record<string, string>,
  getCallback: GetCallback,
  transaction?: Transaction,
) {
  const whereClause: Record<string, string>[] = [];
  for (const [key, value] of Object.entries(properties)) {
    if (!value) continue;
    whereClause.push({ [key]: value });
  }

  const entity = await getCallback(
    { OR: whereClause },
    { id: true },
    transaction,
  );

  if (entity) {
    const keysFormatted = Object.keys(properties).join(' or ');
    throw new ConflictException(`Property ${keysFormatted} already exists`);
  }
}
