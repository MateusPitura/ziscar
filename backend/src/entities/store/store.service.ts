import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { verifyDuplicated } from 'src/utils/verifyDuplicated';
import { CreateInput, FindOneInput, VerifyDuplicatedInput } from './store.type';
import { GetCallback } from 'src/types';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ storeCreateInDto, transaction }: CreateInput) {
    const database = transaction || this.prismaService;

    await this.verifyDuplicated({ cnpj: storeCreateInDto.cnpj });

    const store = await database.store.create({
      data: {
        ...storeCreateInDto,
      },
    });

    return {
      storeId: store.id,
    };
  }

  async findOne({
    enterpriseId,
    where,
    select,
    onlyActive = true,
  }: FindOneInput) {
    if (onlyActive) {
      where['archivedAt'] = null;
    }

    if (enterpriseId) {
      where['enterpriseId'] = enterpriseId;
    }

    const store = await this.prismaService.store.findFirst({
      where,
      select,
    });
    if (onlyActive && !store) {
      throw new NotFoundException('Loja não encontrada');
    }
    return store;
  }

  async verifyDuplicated({ cnpj }: VerifyDuplicatedInput) {
    await verifyDuplicated({
      properties: { cnpj },
      getCallback: this.findOne.bind(this) as GetCallback,
    });
  }
}
