import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentMethodDTO } from 'src/infra/dtos/account-receivable-installment/create-payment-method.dto';
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

  @Post('payment-method/:installmentId')
  async addPaymentMethodToInstallment(
    @Param('installmentId') installmentId: string,
    @Body() body: CreatePaymentMethodDTO,
    @Req() req: AuthRequest,
  ) {
    const { enterpriseId, userId } = req.authToken;
    return this.accountReceivableInstallmentService.addPaymentMethodToInstallment(
      installmentId,
      {
        type: body.type,
        paymentDate: body.paymentDate,
        userId,
      },
      enterpriseId,
    );
  }

  @Get('/by-account/:accountReceivableId')
  async findAllByAccountReceivableId(
    @Param('accountReceivableId') accountReceivableId: string,
    @Req() req: AuthRequest,
  ): Promise<AccountReceivableInstallmentPayload[]> {
    const { enterpriseId } = req.authToken;
    return this.accountReceivableInstallmentService.findAllByAccountReceivableId(
      accountReceivableId,
      enterpriseId,
    );
  }
}
