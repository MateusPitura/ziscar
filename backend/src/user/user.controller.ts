import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserFindAllInDto, UserUpdateInDto } from './user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FETCH_USER, GET_USER } from './user.constants';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

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
