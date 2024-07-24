import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService
  ) {}

  async create(registerUserDto: RegisterUserDto) {
    const user = await this.prismaService.users.create({
      data: {
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: registerUserDto.password,
        departament_id: registerUserDto.departament_id
      }
    });
    return {
      ...user,
      password: undefined
    };
  }

  findAll() {
    return this.prismaService.users.findMany();
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        email
      }
    })

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
