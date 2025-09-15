import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { EducationPartner, PartnerType, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class EducationPartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.EducationPartnerCreateInput,
  ): Promise<EducationPartner> {
    return this.prisma.educationPartner.create({ data });
  }

  async findAll(paginationDto: PaginationDto): Promise<EducationPartner[]> {
    const { offset = 0, limit = 10 } = paginationDto;
    return this.prisma.educationPartner.findMany({
      include: { StudentReview: true },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findtotal(): Promise<number> {
    return this.prisma.educationPartner.count();
  }

  async findOne(id: number): Promise<EducationPartner | null> {
    return this.prisma.educationPartner.findUnique({
      where: { id },
      include: { StudentReview: true },
    });
  }

  async findByOverview(overview: string): Promise<EducationPartner | null> {
    return this.prisma.educationPartner.findFirst({
      where: { overview },
      include: { StudentReview: true },
    });
  }

  async update(
    id: number,
    data: Prisma.EducationPartnerUpdateInput,
  ): Promise<EducationPartner> {
    return this.prisma.educationPartner.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<EducationPartner> {
    return this.prisma.educationPartner.delete({
      where: { id },
    });
  }

  async getPartnerByType(partType: PartnerType): Promise<EducationPartner[]> {
    return this.prisma.educationPartner.findMany({
      where: {
        partnerType: partType,
      },
    });
  }
}
