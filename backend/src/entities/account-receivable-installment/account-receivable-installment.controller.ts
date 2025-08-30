import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateAccountReceivableInstallmentDTO } from 'src/infra/dtos/account-receivable-installment/create-account-receivable-installment.dto';
import { CreatePaymentMethodDTO } from 'src/infra/dtos/account-receivable-installment/create-payment-method.dto';
import { UpdateAccountReceivableInstallmentDTO } from 'src/infra/dtos/account-receivable-installment/update-account-receivable-installment.dto';
import { AccountReceivableInstallmentPayload } from 'src/repositories/account_receivable_installment-repository';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.type';
import { AccountReceivableInstallmentService } from './account-receivable-installment.service';

@Controller('account-receivable-installments')
@UseGuards(AuthGuard)
export class AccountReceivableInstallmentController {
  constructor(
    private readonly accountReceivableInstallmentService: AccountReceivableInstallmentService,
  ) {}

  @Post('/')
  async createAccountReceivableInstallment(
    @Body() body: CreateAccountReceivableInstallmentDTO,
  ) {
    return this.accountReceivableInstallmentService.create(body);
  }

  @Post('payment-method/:installmentId')
  async addPaymentMethodToInstallment(
    @Param('installmentId') installmentId: string,
    @Body() body: CreatePaymentMethodDTO,
    @Req() req: AuthRequest,
  ) {
    return this.accountReceivableInstallmentService.addPaymentMethodToInstallment(
      installmentId,
      {
        type: body.type,
        paymentDate: body.paymentDate,
        userId: req.authToken.userId, // usar o userId do token (já é number)
      },
    );
  }

  @Get('/:id')
  async findByIdAccountReceivableInstallment(@Param('id') id: string) {
    return this.accountReceivableInstallmentService.findById(id);
  }

  @Get('/by-account/:accountReceivableId')
  async findAllByAccountReceivableId(
    @Param('accountReceivableId') accountReceivableId: string,
  ): Promise<AccountReceivableInstallmentPayload[]> {
    return this.accountReceivableInstallmentService.findAllByAccountReceivableId(
      accountReceivableId,
    );
  }

  @Get('/payment-method/:installmentId')
  async findPaymentMethodByInstallmentId(
    @Param('installmentId') installmentId: string,
  ) {
    return this.accountReceivableInstallmentService.findPaymentMethodByInstallmentId(
      installmentId,
    );
  }

  @Put('/:id')
  async updateAccountReceivableInstallment(
    @Param('id') id: string,
    @Body() body: UpdateAccountReceivableInstallmentDTO,
  ) {
    return this.accountReceivableInstallmentService.update(id, body);
  }

  @Delete('/:id')
  async deleteAccountReceivableInstallment(@Param('id') id: string) {
    return this.accountReceivableInstallmentService.delete(id);
  }
}
