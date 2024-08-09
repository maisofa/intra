import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { DepartamentsService } from './departaments.service';
import { CreateDepartamentDto } from './dto/create-departament.dto';
import { UpdateDepartamentDto } from './dto/update-departament.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('departaments')
export class DepartamentsController {
  constructor(private readonly departamentsService: DepartamentsService) {}

  @IsPublic()
  @Post()
  create(@Body() createDepartamentDto: CreateDepartamentDto) {
    try {
      const departament = this.departamentsService.create(createDepartamentDto);
      return departament;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
  
  @IsPublic()
  @Get()
  findAll() {
    return this.departamentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departamentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepartamentDto: UpdateDepartamentDto) {
    return this.departamentsService.update(+id, updateDepartamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departamentsService.remove(+id);
  }
}
