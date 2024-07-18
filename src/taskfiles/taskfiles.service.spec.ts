import { Test, TestingModule } from '@nestjs/testing';
import { TaskfilesService } from './taskfiles.service';

describe('TaskfilesService', () => {
  let service: TaskfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskfilesService],
    }).compile();

    service = module.get<TaskfilesService>(TaskfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
