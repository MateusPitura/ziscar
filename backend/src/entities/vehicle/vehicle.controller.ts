import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InsertVehicleUseCase } from './use-case/insert-vehicle.use-case';
import { SearchVehiclesUseCase } from './use-case/search-vehicles.use-case';
import { InsertExpenseUseCase } from './use-case/insert-expense.use-case';
import { FetchBrandsUseCase } from './use-case/fetch-brands.use-case';
import { MakeSaleUseCase } from './use-case/make-sale.use-case';
import { UpdateVehicleUseCase } from './use-case/update-vehicle.use-case';
import { ToggleArchiveVehicleUseCase } from './use-case/toggle-archive-vehicle.use-case';
import { AuthGuard } from 'src/entities/auth/auth.guard';
import { RoleGuard } from 'src/entities/auth/role.guard';
import { Actions, Resources } from '@prisma/client';
import {
  InsertVehicleRequestDto,
  InsertVehicleExpenseRequestDto,
  SearchVehiclesRequestDto,
  MakeVehicleSaleRequestDto,
  UpdateVehicleRequestDto,
  ToggleArchiveVehicleRequestDto,
} from './dtos';
import { AuthRequest } from '../auth/auth.type';

@Controller('vehicles')
@UseGuards(AuthGuard)
export class VehicleController {
  constructor(
    private readonly insertVehicle: InsertVehicleUseCase,
    private readonly searchVehicles: SearchVehiclesUseCase,
    private readonly insertExpense: InsertExpenseUseCase,
    private readonly fetchBrands: FetchBrandsUseCase,
    private readonly makeSale: MakeSaleUseCase,
    private readonly updateVehicle: UpdateVehicleUseCase,
    private readonly toggleArchiveVehicle: ToggleArchiveVehicleUseCase,
  ) {}

  @Post()
  @RoleGuard(Resources.VEHICLES, Actions.CREATE)
  async create(@Body() input: InsertVehicleRequestDto) {
    return this.insertVehicle.execute(input);
  }

  @Get()
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async search(@Query() query: SearchVehiclesRequestDto) {
    return this.searchVehicles.execute(query);
  }

  @Post('expense')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.CREATE)
  async insertVehicleExpense(
    @Body() input: InsertVehicleExpenseRequestDto,
    @Req() req: AuthRequest,
  ) {
    const { userId } = req.authToken;
    return this.insertExpense.execute(input, userId);
  }

  @Get('brands')
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async brands() {
    return this.fetchBrands.execute();
  }

  @Post('sale')
  @RoleGuard(Resources.VEHICLE_SALE, Actions.CREATE)
  async sale(@Body() input: MakeVehicleSaleRequestDto) {
    return this.makeSale.execute(input);
  }

  @Patch(':id')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() input: Omit<UpdateVehicleRequestDto, 'id'>,
  ) {
    const payload = { ...input, id: Number(id) };
    return this.updateVehicle.execute(payload);
  }

  @Patch(':id/archive')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async toggleArchive(
    @Param('id') id: string,
    @Body() input: Omit<ToggleArchiveVehicleRequestDto, 'id'>,
  ) {
    const payload = { ...input, id: Number(id) };
    return this.toggleArchiveVehicle.execute(payload);
  }
}
