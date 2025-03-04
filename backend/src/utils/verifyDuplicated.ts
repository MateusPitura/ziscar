import { ConflictException } from '@nestjs/common';
import { GetCallback } from '../types';

export async function verifyDuplicated(
  properties: Record<string, string>,
  getCallback: GetCallback,
) {
  const whereClause: Record<string, string>[] = [];
  for (const [key, value] of Object.entries(properties)) {
    if (!value) continue;
    whereClause.push({ [key]: value });
  }

  const entity = await getCallback({ OR: whereClause }, { id: true }, false);

  if (entity) {
    const keysFormatted = Object.keys(properties).join(' ou ');
    throw new ConflictException(`Propriedade ${keysFormatted} já existe`);
  }
}
