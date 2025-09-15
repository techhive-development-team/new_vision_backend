  // happenings.controller.spec.ts
  import { Test, TestingModule } from '@nestjs/testing';
  import { HappeningsController } from './happening.controller';

  describe('HappeningsController', () => {
    let controller: HappeningsController;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [HappeningsController],
      }).compile();

      controller = module.get<HappeningsController>(HappeningsController);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
