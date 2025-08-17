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
import { ArchiveVehicleUseCase } from './use-case/archive-vehicle.use-case';
import { UnarchiveVehicleUseCase } from './use-case/unarchive-vehicle.use-case';
import { AuthGuard } from 'src/entities/auth/auth.guard';
import { RoleGuard } from 'src/entities/auth/role.guard';
import { Actions, Resources } from '@prisma/client';
import {
  InsertVehicleRequestDto,
  InsertVehicleExpenseRequestDto,
  SearchVehiclesRequestDto,
  MakeVehicleSaleRequestDto,
  UpdateVehicleRequestDto,
  UnarchiveVehicleResponseDto,
  UpdateVehicleResponseDto,
  SearchVehiclesResponseDto,
  MakeVehicleSaleResponseDto,
  InsertVehicleResponseDto,
  InsertVehicleExpenseResponseDto,
  FetchVehicleBrandsResponseDto,
  ArchiveVehicleResponseDto,
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
    private readonly archiveVehicle: ArchiveVehicleUseCase,
    private readonly unarchiveVehicle: UnarchiveVehicleUseCase,
  ) {}

  @Post()
  @RoleGuard(Resources.VEHICLES, Actions.CREATE)
  async create(
    @Body() input: InsertVehicleRequestDto,
  ): Promise<InsertVehicleResponseDto> {
    return this.insertVehicle.execute(input);
  }

  @Get()
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async search(
    @Query() query: SearchVehiclesRequestDto,
  ): Promise<SearchVehiclesResponseDto> {
    return this.searchVehicles.execute(query);
  }

  @Post('expense')
  @RoleGuard(Resources.VEHICLE_EXPENSE, Actions.CREATE)
  async insertVehicleExpense(
    @Body() input: InsertVehicleExpenseRequestDto,
    @Req() req: AuthRequest,
  ): Promise<InsertVehicleExpenseResponseDto> {
    const { userId } = req.authToken;
    return this.insertExpense.execute(input, userId);
  }

  @Get('brands')
  @RoleGuard(Resources.VEHICLES, Actions.READ)
  async brands(): Promise<FetchVehicleBrandsResponseDto> {
    return this.fetchBrands.execute();
  }

  @Post('sale')
  @RoleGuard(Resources.VEHICLE_SALE, Actions.CREATE)
  async sale(
    @Body() input: MakeVehicleSaleRequestDto,
    @Req() req: AuthRequest,
  ): Promise<MakeVehicleSaleResponseDto> {
    const { userId } = req.authToken;
    return this.makeSale.execute(input, userId);
  }

  @Patch(':id')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() input: UpdateVehicleRequestDto,
  ): Promise<UpdateVehicleResponseDto> {
    return this.updateVehicle.execute(id, input);
  }

  @Patch(':id/archive')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async archive(@Param('id') id: string): Promise<ArchiveVehicleResponseDto> {
    const payload = { id: Number(id) };
    return this.archiveVehicle.execute(payload);
  }

  @Patch(':id/unarchive')
  @RoleGuard(Resources.VEHICLES, Actions.UPDATE)
  async unarchive(
    @Param('id') id: string,
  ): Promise<UnarchiveVehicleResponseDto> {
    const payload = { id: Number(id) };
    return this.unarchiveVehicle.execute(payload);
  }
}
