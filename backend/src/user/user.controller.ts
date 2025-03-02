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
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateInDto, UserFindAllInDto, UserUpdateInDto } from './user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FETCH_USER, GET_USER } from './user.constants';
import { AuthRequest, AuthSigninOutDto } from '../auth/auth.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Req() req: AuthRequest,
    @Body() userCreateInDto: Omit<UserCreateInDto, 'clientId'>,
  ) {
    const { clientId } = req.authToken as AuthSigninOutDto;

    const createUserPayload = {
      ...userCreateInDto,
      clientId,
    };
    return this.userService.create(createUserPayload);
  }

  @Get()
  async fetch(@Query() query: UserFindAllInDto) {
    return await this.userService.fetch(query, FETCH_USER);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.userService.get({ id: +id }, GET_USER);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() userUpdateInDto: UserUpdateInDto,
  ) {
    return await this.userService.update({ id: +id }, userUpdateInDto);
  }
}
