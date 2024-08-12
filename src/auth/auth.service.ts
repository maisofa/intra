import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { UnauthorizedError } from './errors/unauthorized.error';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(registerAuthDto: RegisterUserDto) {
    const user = await this.userService.findByEmail(registerAuthDto.email);
    if(user) {
      throw new UserAlreadyExistsError();
    }

    registerAuthDto.password = await this.hashPassword(registerAuthDto.password);
    return await this.userService.create(registerAuthDto);
  }

  async login(user: User) {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      user: {
        access_token: this.jwtService.sign(payload),
        id: payload.sub,
      }
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
        };
      }
    }

    throw new UnauthorizedError(
      'Email address or password provided is incorrect.',
    );
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
