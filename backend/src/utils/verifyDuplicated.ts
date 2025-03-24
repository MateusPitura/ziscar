import { ConflictException } from '@nestjs/common';
import { GetCallback } from '../types';

interface VerifyDuplicatedInput {
  properties: Record<string, string | undefined>;
  getCallback: GetCallback;
}

export async function verifyDuplicated({
  properties,
  getCallback,
}: VerifyDuplicatedInput) {
  const whereClause: Record<string, string>[] = [];
  for (const [key, value] of Object.entries(properties)) {
    if (!value) continue;
    whereClause.push({ [key]: value });
  }

  if (!whereClause.length) return;

  const entity = await getCallback({
    where: { OR: whereClause },
    select: { id: true },
    onlyActive: false,
    showNotFoundError: false,
  });

  if (entity) {
    const keysFormatted = Object.keys(properties).join(' ou ');
    throw new ConflictException(`Propriedade ${keysFormatted} já existe`);
  }
}
