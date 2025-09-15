import { Test, TestingModule } from '@nestjs/testing';
import { HappeningsService } from './happening.service';
import { PrismaService } from 'src/config/prisma/prisma.service';

describe('HappeningsService', () => {
  let service: HappeningsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HappeningsService, PrismaService],
    }).compile();

    service = module.get<HappeningsService>(HappeningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});