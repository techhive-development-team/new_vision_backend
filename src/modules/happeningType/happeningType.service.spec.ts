import { Test, TestingModule } from '@nestjs/testing';
import { HappeningTypeService } from './happeningType.service';

describe('HappeningTypeService', () => {
  let service: HappeningTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HappeningTypeService],
    }).compile();

    service = module.get<HappeningTypeService>(HappeningTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
