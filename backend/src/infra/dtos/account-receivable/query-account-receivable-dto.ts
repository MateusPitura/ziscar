import { queryAccountReceivableDTO } from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';

export class QueryAccountReceivableDTO extends createZodDto(
  queryAccountReceivableDTO,
) {}
