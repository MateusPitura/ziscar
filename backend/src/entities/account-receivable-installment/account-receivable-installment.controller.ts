import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AccountReceivableInstallmentService } from "./account-receivable-installment.service";
import { CreateAccountReceivableInstallmentDTO } from "src/infra/dtos/account-receivable-installment/create-account-receivable-installment.dto";
import { UpdateAccountReceivableInstallmentDTO } from "src/infra/dtos/account-receivable-installment/update-account-receivable-installment.dto";

@Controller('account-receivable-installment')
export class AccountReceivableInstallmentController {
    constructor(private readonly accountReceivableInstallmentService: AccountReceivableInstallmentService) { }

    @Post('/')
    async createAccountReceivableInstallment(@Body() body: CreateAccountReceivableInstallmentDTO) {
        return this.accountReceivableInstallmentService.create(body);
    }

    @Get('/:id')
    async findByIdAccountReceivableInstallment(@Param('id') id: string) {
        return this.accountReceivableInstallmentService.findById(id);
    }

    @Put('/:id')
    async updateAccountReceivableInstallment(@Param('id') id: string, @Body() body: UpdateAccountReceivableInstallmentDTO) {
        return this.accountReceivableInstallmentService.update(id, body);
    }

    @Delete('/:id')
    async deleteAccountReceivableInstallment(@Param('id') id: string) {
        return this.accountReceivableInstallmentService.delete(id);
    }

    //aaa
}