import { Injectable } from '@nestjs/common';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto, userId: number) {
    return await this.prismaService.questions.create({
      data: { ...createQuestionDto, userId },
    });
  }

  async findAll() {
    return await this.prismaService.questions.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.questions.findUnique({ where: { id } });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return await this.prismaService.questions.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  remove(id: number) {
    return this.prismaService.questions.delete({ where: { id } });
  }
}
