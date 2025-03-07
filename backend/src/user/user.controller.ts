import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Post,
  Req,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { FETCH_USER, GET_USER } from './user.constant';
import { AuthRequest } from '../auth/auth.type';
import {
  UserPostInDto,
  UserFetchInDto,
  UserPatchInDto,
  ProfilePatchInDto,
  UserDeleteInDto,
} from './user.schema';
import { ParamInputs } from 'src/schemas';
import { Actions, Resources } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';

@Controller()
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RoleGuard(Resources.USERS, Actions.CREATE)
  @Post('user')
  post(@Req() req: AuthRequest, @Body() userPostInDto: UserPostInDto) {
    const { clientId } = req.authToken;

    const createUserPayload = {
      ...userPostInDto,
      clientId,
    };
    return this.userService.create(createUserPayload);
  }

  @RoleGuard(Resources.USERS, Actions.READ)
  @Get('user')
  async fetch(
    @Req() req: AuthRequest,
    @Query() userFetchInDto: UserFetchInDto,
  ) {
    const { userId } = req.authToken;
    return await this.userService.findMany(userFetchInDto, +userId, FETCH_USER);
  }

  @Get('profile')
  async getProfile(@Req() req: AuthRequest) {
    const { userId } = req.authToken;
    return await this.userService.findOne({ id: +userId }, GET_USER);
  }

  @Get('permissions')
  async getPermissions(@Req() req: AuthRequest) {
    const { userId } = req.authToken;
    return await this.userService.getPermissions(+userId);
  }

  @RoleGuard(Resources.USERS, Actions.READ)
  @Get('user/:id')
  async get(@Req() req: AuthRequest, @Param() { id }: ParamInputs) {
    const { userId } = req.authToken;
    if (userId == id) {
      throw new ForbiddenException(
        'Use a rota /profile para acessar seus dados',
      );
    }
    return await this.userService.findOne({ id: +id }, GET_USER);
  }

  @Patch('profile')
  async patchProfile(
    @Req() req: AuthRequest,
    @Body() profilePatchInDto: ProfilePatchInDto,
  ) {
    const { userId } = req.authToken;
    return await this.userService.update({ id: +userId }, profilePatchInDto);
  }

  @RoleGuard(Resources.USERS, Actions.UPDATE)
  @Patch('user/:id')
  async patch(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() userPatchInDto: UserPatchInDto,
  ) {
    const { userId } = req.authToken;
    if (userId == id) {
      throw new ForbiddenException(
        'Use a rota /profile para atualizar seus dados',
      );
    }
    return await this.userService.update({ id: +id }, userPatchInDto);
  }

  @RoleGuard(Resources.USERS, Actions.DELETE)
  @Delete('user/:id')
  async disable(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() userDeleteInDto: UserDeleteInDto,
  ) {
    const { userId } = req.authToken;
    if (userId == id) {
      throw new ForbiddenException(
        'Você não pode desativar o seu próprio usuário',
      );
    }
    return await this.userService.update({ id: +id }, userDeleteInDto);
  }
}
