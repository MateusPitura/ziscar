import { Prisma } from '@prisma/client';

export type CreateQuestionDto = Omit<
  Prisma.QuestionsCreateInput,
  'createAt' | 'updateAt' | 'answers' | 'user'
>;
