import { Test, TestingModule } from '@nestjs/testing';
import { EducationPartnersService } from './education_partners.service';

describe('EducationPartnersService', () => {
  let service: EducationPartnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationPartnersService],
    }).compile();

    service = module.get<EducationPartnersService>(EducationPartnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
