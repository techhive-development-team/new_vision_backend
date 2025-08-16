import { Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async getImages(): Promise<Image[]> {
    return this.prisma.image.findMany();
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
}
