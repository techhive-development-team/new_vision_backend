import { StudentReviewService } from "./studentReview.service"
import { Test, TestingModule } from '@nestjs/testing';

describe('StudentReviewServie', () => {
  let service: StudentReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentReviewService],
    }).compile();

    service = module.get<StudentReviewService>(StudentReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});