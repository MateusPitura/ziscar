import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { v4 } from 'uuid';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  private readonly users: UserDto[] = [];

  create(newUser: UserDto) {
    newUser.id = v4();
    newUser.password = hashSync(newUser.password, 10);
    this.users.push(newUser);
  }

  findByUsername(username: string): UserDto | null {
    return this.users.find((user) => user.username === username) || null;
  }
}
