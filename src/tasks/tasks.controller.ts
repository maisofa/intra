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
    // return this.tasksService.create(createTaskDto);
  }

  @Post('request')
  requestTaskToUser(@Req() req: AuthRequest, @Body() requestTaskDto: RequestTaskDto) {
    const user = req.user;

    return this.tasksService.requestTaskToUser(user, requestTaskDto);
  }

  @Patch('accept/:id')
  acceptTask(@Param('id') id: string) {
    return this.tasksService.acceptTask(id);
  }

  @Patch('reject/:id')
  rejectTask(@Param('id') id: string) {
    return this.tasksService.rejectTask(id);
  }

  @Get()
  async findAll(@Req() req: AuthRequest) {
    const tasks = await this.tasksService.findAll(req.user.id);
    return tasks;
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
