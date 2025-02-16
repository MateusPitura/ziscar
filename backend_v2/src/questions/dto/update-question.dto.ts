import { Prisma } from '@prisma/client';

export type UpdateQuestionDto = Omit<
  Prisma.QuestionsUpdateInput,
  'createAt' | 'updateAt' | 'answers' | 'user'
>;
