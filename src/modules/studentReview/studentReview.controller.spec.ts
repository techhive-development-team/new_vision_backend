import { Test, TestingModule } from '@nestjs/testing';
import { StudentReviewController } from './studentReview.controller';

describe('StudentReviewController', () => {
  let controller: StudentReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentReviewController],
    }).compile();

    controller = module.get<StudentReviewController>(StudentReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
