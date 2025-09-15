import { Prisma, StudentReview } from '@prisma/client';
import { PaginationDto } from './../../common/dto/pagination-dto';
import { PrismaService } from "src/config/prisma/prisma.service";

export class StudentReviewService {
    constructor(private prisma: PrismaService) {}

    async getStudentReview(paginationDto: PaginationDto): Promise<StudentReview[]>{
        const { limit, offset } = paginationDto;
        return this.prisma.studentReview.findMany({
            include:{ educationPartner: true },
            take: limit,
            skip: offset,
            orderBy: {

            },
        });
    }

    async getTotalStudentReview(): Promise<number>{
        return this.prisma.studentReview.count();
    }

    async createStudentReview(data: Prisma.StudentReviewCreateInput): Promise<StudentReview> {
        return this.prisma.studentReview.create({data});
    }

    async getStudentReviewById(id: number): Promise<StudentReview | null> {
        return this.prisma.studentReview.findUnique({
            where:{id},
            include: { educationPartner: true },
        });
    }

    async updateStudentReview(id: number, data: Prisma.StudentReviewUpdateInput): Promise<StudentReview> {
        return this.prisma.studentReview.update({
            where: {id},
            data,
        });
    }

    async deleteStudentReview(id: number): Promise<StudentReview> {
        return this.prisma.studentReview.delete({ where: {id} });
    }

    async getStudentReviewsByEducationPartnerId(educationPartnerId: number): Promise<StudentReview[]> {
    return this.prisma.studentReview.findMany({
      where: { educationPartnerId },
      include: { educationPartner: true },
      orderBy: { createdAt: 'desc' },
    });
  }

}