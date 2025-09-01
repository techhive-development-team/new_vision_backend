import { Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async getImages(paginationDto: PaginationDto): Promise<Image[]> {
    const { limit, offset } = paginationDto;
    return this.prisma.image.findMany({
      include: { imageType: true },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTotalImages(): Promise<number> {
    return this.prisma.image.count();
  }

  async createImage(data: Prisma.ImageCreateInput): Promise<Image> {
    return this.prisma.image.create({ data });
  }

  async getMainImage() {
    return this.prisma.imageType.findMany({
      include: {
        _count: {
          select: { images: true },
        },
        images: true,
      },
    });
  }

  async getImageById(id: number): Promise<Image | null> {
    return this.prisma.image.findUnique({
      where: { id },
      include: { imageType: true },
    });
  }

  async deleteImage(id: number): Promise<Image> {
    return this.prisma.image.delete({ where: { id } });
  }
}
