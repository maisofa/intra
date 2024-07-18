import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskfilesService } from './taskfiles.service';
import { CreateTaskfileDto } from './dto/create-taskfile.dto';
import { UpdateTaskfileDto } from './dto/update-taskfile.dto';

@Controller('taskfiles')
export class TaskfilesController {
  constructor(private readonly taskfilesService: TaskfilesService) {}

  @Post()
  create(@Body() createTaskfileDto: CreateTaskfileDto) {
    return this.taskfilesService.create(createTaskfileDto);
  }

  @Get()
  findAll() {
    return this.taskfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskfileDto: UpdateTaskfileDto) {
    return this.taskfilesService.update(+id, updateTaskfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskfilesService.remove(+id);
  }
}
