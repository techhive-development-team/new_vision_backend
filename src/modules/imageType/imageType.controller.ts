import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ImageTypeService } from './imageType.service';
import { Prisma, ImageType as ImageTypeModel } from '@prisma/client';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { CreateImageTypeDto } from './dto/create-imageType.dto';

@Controller('imageType')
export class ImageTypeController {
  constructor(private readonly imageTypeService: ImageTypeService) {}

  @Post()
  createImageType(
    @Body(new ValidationPipe()) imageTypeData: CreateImageTypeDto,
  ): Promise<ImageTypeModel> {
    return this.imageTypeService.createImageType(imageTypeData);
  }

  @Get()
  getMainImage(): Promise<ImageTypeModel[]> {
    return this.imageTypeService.getImageType();
  }
}
