import { Injectable } from '@nestjs/common';
import { CreateTaskfileDto } from './dto/create-taskfile.dto';
import { UpdateTaskfileDto } from './dto/update-taskfile.dto';

@Injectable()
export class TaskfilesService {
  create(createTaskfileDto: CreateTaskfileDto) {
    return 'This action adds a new taskfile';
  }

  findAll() {
    return `This action returns all taskfiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskfile`;
  }

  update(id: number, updateTaskfileDto: UpdateTaskfileDto) {
    return `This action updates a #${id} taskfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskfile`;
  }
}
