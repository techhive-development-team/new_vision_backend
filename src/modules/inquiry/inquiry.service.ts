import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Inquiry, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class InquiryService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.InquiryCreateInput): Promise<Inquiry> {
    return this.prisma.inquiry.create({ data });
  }

  async findAll(paginationDto: PaginationDto): Promise<Inquiry[]> {
    const { limit, offset } = paginationDto;
    return this.prisma.inquiry.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTotalInquiries(): Promise<number> {
    return this.prisma.inquiry.count();
  }

  async findOne(id: number) {
    return this.prisma.inquiry.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.inquiry.delete({
      where: { id },
    });
  }
}
