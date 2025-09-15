import { Test, TestingModule } from '@nestjs/testing';
import { EducationPartnersController } from './education_partners.controller';
import { EducationPartnersService } from './education_partners.service';

describe('EducationPartnersController', () => {
  let controller: EducationPartnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationPartnersController],
      providers: [EducationPartnersService],
    }).compile();

    controller = module.get<EducationPartnersController>(EducationPartnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
