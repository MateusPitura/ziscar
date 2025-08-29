import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AccountReceivableService } from './account-receivable.service';
import { CreateAccountReceivableDTO } from 'src/infra/dtos/account-receivable/create-account-receivable.dto';
import { UpdateAccountReceivableDTO } from 'src/infra/dtos/account-receivable/update-account-receivable.dto';
import { QueryAccountReceivableDTO } from 'src/infra/dtos/account-receivable/query-account-receivable-dto';
import { SearchResponse } from 'src/repositories/account_receivable-repository';

@Controller('account-receivable')
export class AccountReceivableController {
  constructor(
    private readonly AccountReceivableService: AccountReceivableService,
  ) { }

  @Post('/')
  async createAccountReceivable(@Body() body: CreateAccountReceivableDTO) {
    return this.AccountReceivableService.create(body);
  }

  @Get('search')
  async searchAccountsReceivable(
    @Query() queryParams: QueryAccountReceivableDTO
  ): Promise<SearchResponse> {
    try {
      // Os parâmetros já vêm validados pelo ZodValidationPipe
      const searchRequest = {
        page: queryParams.page,
        limit: queryParams.limit ?? 10,
        startDate: queryParams.startDate ? new Date(queryParams.startDate) : undefined,
        endDate: queryParams.endDate ? new Date(queryParams.endDate) : undefined,
        overallStatus: queryParams.overallStatus,
        orderBy: queryParams.orderBy,
      };

      // Validações adicionais
      if (searchRequest.startDate && searchRequest.endDate &&
        searchRequest.startDate > searchRequest.endDate) {
        throw new BadRequestException('startDate deve ser anterior ou igual à endDate');
      }

      // Chamar o service
      const result = await this.AccountReceivableService.search(searchRequest);

      return result;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Log do erro para debugging
      console.error('Error in searchAccountsReceivable:', error);

      throw new BadRequestException('Erro ao buscar contas a receber');
    }
  }





  @Get('/:id')
  async findByIdAccountReceivable(@Param('id') id: string) {
    return this.AccountReceivableService.findById(id);
  }

  @Get('/by-installment/:installmentId')
  async findByInstallmentId(@Param('installmentId') installmentId: string) {
    return this.AccountReceivableService.findByInstallmentId(installmentId);
  }

  @Put('/:id')
  async updateAccountReceivable(
    @Param('id') id: string,
    @Body() body: UpdateAccountReceivableDTO,
  ) {
    return this.AccountReceivableService.update(id, body);
  }

  @Delete('/:id')
  async deleteAccountReceivable(@Param('id') id: string) {
    return this.AccountReceivableService.delete(id);
  }
}
