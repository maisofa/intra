import { Test, TestingModule } from '@nestjs/testing';
import { TaskfilesController } from './taskfiles.controller';
import { TaskfilesService } from './taskfiles.service';

describe('TaskfilesController', () => {
  let controller: TaskfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskfilesController],
      providers: [TaskfilesService],
    }).compile();

    controller = module.get<TaskfilesController>(TaskfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
