import { ValidationException } from './../../common/exceptions/validation.exception';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ImageTypeService } from './imageType.service';
import { Prisma, ImageType as ImageTypeModel } from '@prisma/client';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { CreateImageTypeDto } from './dto/create-imageType.dto';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { ImagesService } from '../images/images.service';

@Controller('imageType')
export class ImageTypeController {
  constructor(
    private readonly imageTypeService: ImageTypeService,
    private readonly imageService: ImagesService,
  ) {}

  @Post()
  async createImageType(
    @Body(new ValidationPipe()) imageTypeData: CreateImageTypeDto,
  ): Promise<SuccessResponse> {
    const imageType =
      await this.imageTypeService.createImageType(imageTypeData);
    return new SuccessResponse(imageType);
  }

  @Get()
  async getImageTypes(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const images = await this.imageTypeService.getImageTypes(paginationDto);
    const total = await this.imageTypeService.getTotalImageTypes();
    return new SuccessResponse(images, { total });
  }

  @Get(':id')
  async getImageTypeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const imageType = await this.imageTypeService.getImageTypeById(id);
    if (!imageType) {
      throw new ValidationException('id', 'Image type not found.');
    }
    return new SuccessResponse(imageType);
  }

  @Put(':id')
  async updateImageType(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateData: Prisma.ImageTypeUpdateInput,
  ): Promise<SuccessResponse> {
    const oldImageType = await this.imageTypeService.getImageTypeById(id);
    if (!oldImageType) {
      throw new ValidationException('id', 'Image type not found.');
    }
    const updatedImageType = await this.imageTypeService.updateImageType(
      id,
      updateData,
    );
    return new SuccessResponse(updatedImageType);
  }

  @Delete(':id')
  async deleteImageType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const imageType = await this.imageTypeService.getImageTypeById(id);
    const images = await this.imageService.getImagesByTypeId(id);
    if (!imageType) {
      throw new ValidationException('id', 'Image type not found.');
    }
    if (images.length > 0) {
      throw new ValidationException(
        'id',
        `Cannot delete ImageType ${id}, it is still used in ${images.length} images`,
      );
    }
    await this.imageTypeService.deleteImageType(id);
    return new SuccessResponse(null, {
      message: 'Image type deleted successfully',
    });
  }
}
