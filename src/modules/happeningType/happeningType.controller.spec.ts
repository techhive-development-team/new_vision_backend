import { Test, TestingModule } from '@nestjs/testing';
import { HappeningTypeController } from './happeningType.controller';

describe('HappeningTypeController', () => {
  let controller: HappeningTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HappeningTypeController],
    }).compile();

    controller = module.get<HappeningTypeController>(HappeningTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
