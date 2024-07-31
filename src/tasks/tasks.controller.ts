import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { RequestTaskDto } from './dto/request-task.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() createTaskDto: CreateTaskDto) {
    const user = req.user;
    console.log(user);
    // return this.tasksService.create(createTaskDto);
  }

  @IsPublic()
  @Post('request')
  requestTaskToUser(@Req() req: AuthRequest, @Body() requestTaskDto: RequestTaskDto) {
    const user = req.user;
    return this.tasksService.requestTaskToUser(requestTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
