import { Prisma, StudentReview } from '@prisma/client';
import { PaginationDto } from './../../common/dto/pagination-dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StudentReviewService {
  constructor(private prisma: PrismaService) {}

  async getStudentReview(
    paginationDto: PaginationDto,
  ): Promise<StudentReview[]> {
    const { limit, offset } = paginationDto;
    return this.prisma.studentReview.findMany({
      include: { educationPartner: true },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTotalStudentReview(): Promise<number> {
    return this.prisma.studentReview.count();
  }

  async createStudentReview(
    data: Prisma.StudentReviewCreateInput,
  ): Promise<StudentReview> {
    return this.prisma.studentReview.create({
      data,
      include: { educationPartner: true },
    });
  }

  async getStudentReviewById(id: number): Promise<StudentReview> {
    const review = await this.prisma.studentReview.findUnique({
      where: { id },
      include: { educationPartner: true },
    });

    if (!review) {
      throw new NotFoundException(`StudentReview with id ${id} not found`);
    }

    return review;
  }

  async updateStudentReview(
    id: number,
    data: Prisma.StudentReviewUpdateInput,
  ): Promise<StudentReview> {
    // Ensure the review exists before updating
    await this.getStudentReviewById(id);

    return this.prisma.studentReview.update({
      where: { id },
      data,
      include: { educationPartner: true },
    });
  }

  async deleteStudentReview(id: number): Promise<void> {
    // Ensure the review exists before deleting
    await this.getStudentReviewById(id);

    await this.prisma.studentReview.delete({ where: { id } });
  }

  async getStudentReviewsByEducationPartnerId(
    educationPartnerId: number,
  ): Promise<StudentReview[]> {
    return this.prisma.studentReview.findMany({
      where: { educationPartnerId },
      include: { educationPartner: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
