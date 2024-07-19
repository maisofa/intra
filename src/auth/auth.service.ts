import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService
  ) {}

  async register(registerAuthDto: RegisterUserDto) {
    const user = await this.userService.findByEmail(registerAuthDto.email);

    if(user) {
      throw new UserAlreadyExistsError();
    }

    registerAuthDto.password = await this.hashPassword(registerAuthDto.password);
    return await this.userService.create(registerAuthDto);
  }

  private async hashPassword(rawPass: string) {
    const hash = await bcrypt.hash(rawPass, 10);
    return hash;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
