import { Injectable } from '@nestjs/common';
import { HappeningType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class HappeningTypeService {
  constructor(private prisma: PrismaService) {}

  async createHappeningType(data: Prisma.HappeningTypeCreateInput): Promise<HappeningType> {
    return this.prisma.happeningType.create({ data });
  }

  async getHappeningTypes(paginationDto: PaginationDto): Promise<HappeningType[]> {
    const { offset = 0, limit = 10 } = paginationDto;

    return this.prisma.happeningType.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        
      },
    });
  }

  async getTotalHappeningTypes(): Promise<number> {
    return this.prisma.happeningType.count();
  }

  async getHappeningTypeById(id: number): Promise<HappeningType | null> {
    return this.prisma.happeningType.findFirst({
      where: { id },
    });
  }

  async updateHappeningType(id: number, data: Prisma.HappeningTypeUpdateInput): Promise<HappeningType> {
    return this.prisma.happeningType.update({
      where: { id },
      data,
    });
  }

  async deleteHappeningType(id: number): Promise<HappeningType> {
    return this.prisma.happeningType.delete({ where: { id } });
  }
}
