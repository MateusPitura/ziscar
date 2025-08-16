import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AccountReceivableService } from './account-receivable.service';
import { CreateAccountReceivableDTO } from 'src/infra/dtos/account-receivable/create-account-receivable.dto';
import { UpdateAccountReceivableDTO } from 'src/infra/dtos/account-receivable/update-account-receivable.dto';

@Controller('account-receivable')
export class AccountReceivableController {
    constructor(private readonly AccountReceivableService: AccountReceivableService) { }

    @Post('/')
    async createAccountReceivable(@Body() body: CreateAccountReceivableDTO) {
        return this.AccountReceivableService.create(body);
    }

    @Get('/:id')
    async findByIdAccountReceivable(@Param('id') id: string) {
        return this.AccountReceivableService.findById(id);
    }

    @Put('/:id')
    async updateAccountReceivable(@Param('id') id: string, @Body() body: UpdateAccountReceivableDTO) {
        return this.AccountReceivableService.update(id, body);
    }

    @Delete('/:id')
    async deleteAccountReceivable(@Param('id') id: string) {
        return this.AccountReceivableService.delete(id);
    }
}
