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
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { FETCH_USER, GET_USER } from './user.constant';
import { AuthRequest } from '../auth/auth.type';
import { UserPostInDto, UserFetchInDto, UserPatchInDto } from './user.schema';
import { ParamInputs } from 'src/schemas';

@Controller()
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  post(@Req() req: AuthRequest, @Body() userPostInDto: UserPostInDto) {
    const { clientId } = req.authToken;

    const createUserPayload = {
      ...userPostInDto,
      clientId,
    };
    return this.userService.create(createUserPayload);
  }

  @Get('user')
  async fetch(
    @Req() req: AuthRequest,
    @Query() userFetchInDto: UserFetchInDto,
  ) {
    const { userId } = req.authToken;
    return await this.userService.findMany(userFetchInDto, +userId, FETCH_USER);
  }

  @Get('profile')
  async getMe(@Req() req: AuthRequest) {
    const { userId } = req.authToken;
    return await this.userService.findOne({ id: +userId }, GET_USER);
  }

  @Get('user/:id')
  async get(@Req() req: AuthRequest, @Param() { id }: ParamInputs) {
    const { userId } = req.authToken;
    if (userId == id) {
      throw new ForbiddenException('Use a rota /me para acessar seus dados');
    }
    return await this.userService.findOne({ id: +id }, GET_USER);
  }

  @Patch('profile')
  async patchMe(
    @Req() req: AuthRequest,
    @Body() userPatchInDto: UserPatchInDto,
  ) {
    const { userId } = req.authToken;
    return await this.userService.update({ id: +userId }, userPatchInDto);
  }

  @Patch('user/:id')
  async patch(
    @Req() req: AuthRequest,
    @Param() { id }: ParamInputs,
    @Body() userPatchInDto: UserPatchInDto,
  ) {
    const { userId } = req.authToken;
    if (userId == id) {
      throw new ForbiddenException('Use a rota /me para atualizar seus dados');
    }
    return await this.userService.update({ id: +id }, userPatchInDto);
  }
}
