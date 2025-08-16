import { Injectable } from '@nestjs/common';
import { ImageType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ImageTypeService {
  constructor(private prisma: PrismaService) {}

  async createImageType(data: Prisma.ImageTypeCreateInput): Promise<ImageType> {
    return this.prisma.imageType.create({ data });
  }

  async getImageType(): Promise<ImageType[]> {
    return this.prisma.imageType.findMany();
  }

  async getImageTypeById(id: number): Promise<ImageType | null> {
    return this.prisma.imageType.findFirst({
      where: { id },
    });
  }
}
