import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(
    private prismaService: PrismaService
  ) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.prismaService.departaments.create({
      data: {
        name: createDepartmentDto.name
      }
    });

    return department;
  }

  findAll() {
    return this.prismaService.departaments.findMany();
  }

  findOne(id: string) {
    return this.prismaService.departaments.findUnique({
      where: {
        id  
      }
    });
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  remove(id: number) {
    return `This action removes a #${id} department`;
  }
}
