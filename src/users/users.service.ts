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
        departament_id: registerUserDto.departament_id,
        user_role: registerUserDto.user_role
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

  async findById(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id
      },
      include: {
        receiverTasks: true,
        senderTasks: true
      }
    })

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        email
      }
    })

    return user;
  }

  remove(id: string) {
    return this.prismaService.users.delete({
      where: {
        id
      }
    })
  }
}
