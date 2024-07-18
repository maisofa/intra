import { Module } from '@nestjs/common';
import { TaskfilesService } from './taskfiles.service';
import { TaskfilesController } from './taskfiles.controller';

@Module({
  controllers: [TaskfilesController],
  providers: [TaskfilesService],
})
export class TaskfilesModule {}
