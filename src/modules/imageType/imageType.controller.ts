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

@Controller('imageType')
export class ImageTypeController {
  constructor(private readonly imageTypeService: ImageTypeService) {}

  @Post()
  async createImageType(
    @Body(new ValidationPipe()) imageTypeData: CreateImageTypeDto,
  ): Promise<SuccessResponse> {
    const newImageType =
      await this.imageTypeService.createImageType(imageTypeData);
    return new SuccessResponse('data', newImageType);
  }

  //   @Post()
  //   createImageType(
  //       @Body(new ValidationPipe()) imageTypeData: CreateImageTypeDto,
  //     ): Promise<ImageTypeModel> {
  //       return this.imageTypeService.createImageType(imageTypeData);
  // }

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
    return new SuccessResponse('data', updatedImageType);
  }

  @Delete(':id')
  async deleteImageType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const imageType = await this.imageTypeService.getImageTypeById(id);
    if (!imageType) {
      throw new ValidationException('id', 'Image type not found.');
    }
    await this.imageTypeService.deleteImageType(id);
    return new SuccessResponse('data', null);
  }
}
