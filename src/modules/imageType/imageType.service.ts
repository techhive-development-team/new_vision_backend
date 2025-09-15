import { Injectable } from '@nestjs/common';
import { ImageType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
@Injectable()
export class ImageTypeService {
  constructor(private prisma: PrismaService) {}

  async createImageType(data: Prisma.ImageTypeCreateInput): Promise<ImageType> {
    return this.prisma.imageType.create({ data });
  }

  async getImageTypes(paginationDto: PaginationDto): Promise<ImageType[]> {
    const { offset = 0, limit = 10 } = paginationDto;

    return this.prisma.imageType.findMany({
      skip: offset,
      take: limit,
      orderBy: {},
    });
  }

  async getTotalImageTypes(): Promise<number> {
    return this.prisma.imageType.count();
  }

  async getImageTypeById(id: number): Promise<ImageType | null> {
    return this.prisma.imageType.findFirst({
      where: { id },
    });
  }

  async updateImageType(
    id: number,
    data: Prisma.ImageTypeUpdateInput,
  ): Promise<ImageType> {
    return this.prisma.imageType.update({
      where: { id },
      data,
    });
  }

  async deleteImageType(id: number): Promise<ImageType> {
    return this.prisma.imageType.delete({ where: { id } });
  }

  async getImageById(id: number): Promise<ImageType | null> {
    return this.prisma.imageType.findFirst({
      where: { id },
      include: {
        images: true,
      },
    });
  }
}
