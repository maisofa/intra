import { Injectable } from '@nestjs/common';
import { CreateDepartamentDto } from './dto/create-departament.dto';
import { UpdateDepartamentDto } from './dto/update-departament.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepartamentsService {
  constructor(
    private prismService: PrismaService,
  ) {}

  create(createDepartamentDto: CreateDepartamentDto) {
    const departament = this.prismService.departaments.create({
      data: {
        name: createDepartamentDto.name,
      }
    });

    return departament;
  }

  findAll() {
    return this.prismService.departaments.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} departament`;
  }

  update(id: number, updateDepartamentDto: UpdateDepartamentDto) {
    return `This action updates a #${id} departament`;
  }

  remove(id: number) {
    return `This action removes a #${id} departament`;
  }
}
