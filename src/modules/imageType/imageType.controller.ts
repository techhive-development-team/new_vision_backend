import { Body, Controller, Get, Post } from '@nestjs/common';
import { ImageTypeService } from './imageType.service';
import { Prisma, ImageType as ImageTypeModel } from '@prisma/client';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

@Controller('imageType')
export class ImageTypeController {
  constructor(private readonly imageTypeService: ImageTypeService) {}

  @Post()
  createImageType(
    @Body() imageTypeData: Prisma.ImageTypeCreateInput,
  ): Promise<ImageTypeModel> {
    return this.imageTypeService.createImageType(imageTypeData);
  }

  @Get()
  getMainImage(): Promise<ImageTypeModel[]> {
    return this.imageTypeService.getImageType();
  }
}
