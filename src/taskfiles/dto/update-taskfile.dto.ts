import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskfileDto } from './create-taskfile.dto';

export class UpdateTaskfileDto extends PartialType(CreateTaskfileDto) {}
