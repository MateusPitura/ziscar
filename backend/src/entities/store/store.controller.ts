import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Actions, Resources } from '@prisma/client';
import { AuthRequest } from '../auth/auth.type';
import { StoreDeleteInDto, StoreFindManyInDto, StorePatchInDto, StorePostInDto } from './store.schema';
import { StoreService } from './store.service';
import { FETCH_STORE, GET_STORE } from './store.constant';
import { ParamInputs } from 'src/types';

@Controller('store')
@UseGuards(AuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @RoleGuard(Resources.STORES, Actions.CREATE)
  @Post()
  post(@Req() req: AuthRequest, @Body() storePostInDto: StorePostInDto) {
    const { enterpriseId } = req.authToken;

    const createStorePayload = {
      ...storePostInDto,
      enterpriseId,
    };
    return this.storeService.create({ storeCreateInDto: createStorePayload });
  }

  @RoleGuard(Resources.STORES, Actions.READ)
  @Get()
  async findMany(
    @Req() req: AuthRequest,
    @Query() storeFindManyInDto: StoreFindManyInDto,
  ) {
    const { enterpriseId } = req.authToken;
    return await this.storeService.findMany({
      storeFindManyInDto,
      select: FETCH_STORE,
      enterpriseId,
    });
  }

  @RoleGuard(Resources.STORES, Actions.READ)
  @Get(':id')
  async get(@Req() req: AuthRequest, @Param() { id }: ParamInputs) {
    const { enterpriseId } = req.authToken;

    return await this.storeService.findOne({
      where: { id: +id },
      select: GET_STORE,
      enterpriseId,
    });
  }

  @RoleGuard(Resources.STORES, Actions.UPDATE)
  @Patch(':id')
  async patch(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() storePatchInDto: StorePatchInDto,
  ) {
    const { enterpriseId } = req.authToken;

    return await this.storeService.update({
      where: { id: +id },
      storeUpdateInDto: storePatchInDto,
      enterpriseId,
    });
  }

  @RoleGuard(Resources.STORES, Actions.DELETE)
  @Delete(':id')
  async disable(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() userDeleteInDto: StoreDeleteInDto,
  ) {
    const { enterpriseId } = req.authToken;

    return await this.storeService.update({
      where: { id: +id },
      storeUpdateInDto: userDeleteInDto,
      enterpriseId,
    });
  }
}
