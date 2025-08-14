import { Test, TestingModule } from '@nestjs/testing';
import { ImageTypeController } from './image-type.controller';

describe('ImageTypeController', () => {
  let controller: ImageTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageTypeController],
    }).compile();

    controller = module.get<ImageTypeController>(ImageTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
