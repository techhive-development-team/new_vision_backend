import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Courses, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CoursesCreateInput): Promise<Courses> {
    return this.prisma.courses.create({
      data,
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<Courses[]> {
    const { limit, offset } = paginationDto;
    return this.prisma.courses.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTotalCourses(): Promise<number> {
    return this.prisma.courses.count();
  }

  async findOne(id: number): Promise<Courses | null> {
    return this.prisma.courses.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.CoursesUpdateInput): Promise<Courses> {
    return this.prisma.courses.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Courses> {
    return this.prisma.courses.delete({
      where: { id },
    });
  }

  async getCoursesGroupedByIsOpened() {
    const opened = await this.prisma.courses.findMany({
      where: { isOpened: true },
    });

    const closed = await this.prisma.courses.findMany({
      where: { isOpened: false },
    });

    return { opened, closed };
  }
}
