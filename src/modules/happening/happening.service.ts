// happening.service.ts
import { Injectable } from '@nestjs/common';
import { Happening, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class HappeningsService {
  constructor(private prisma: PrismaService) {}

  async getHappenings(paginationDto: PaginationDto): Promise<Happening[]> {
    const { limit, offset } = paginationDto;
    return this.prisma.happening.findMany({
      include: { happeningType: true, album: { include: { images: true } } },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTotalHappenings(): Promise<number> {
    return this.prisma.happening.count();
  }

  async createHappening(data: Prisma.HappeningCreateInput): Promise<Happening> {
    return this.prisma.happening.create({ data });
  }

  async getHappeningsByTypeId(happeningTypeId: number): Promise<Happening[]> {
    return this.prisma.happening.findMany({
      where: { happeningTypeId },
      include: { happeningType: true, album: { include: { images: true } } },
    });
  }

  async getMainHappening() {
  return this.prisma.happeningType.findMany({
    include: {
      _count: {
        select: { Happening: true },
      },
      Happening: true, 
    },
  });
}


  async getHappeningById(id: number): Promise<Happening | null> {
    return this.prisma.happening.findUnique({
      where: { id },
      include: { happeningType: true, album: { include: { images: true } } },
    });
  }

  async deleteHappening(id: number): Promise<Happening> {
    return this.prisma.happening.delete({ where: { id } });
  }

  async updateHappening(
    id: number,
    data: Prisma.HappeningUpdateInput,
  ): Promise<Happening> {
    return this.prisma.happening.update({
      where: { id },
      data,
    });
  }
}
