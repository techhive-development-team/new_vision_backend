import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Query,
  Delete,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ImagesService } from './images.service';
import { ImageCreateFileDto } from './dto/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageTypeService } from 'src/modules/imageType/imageType.service';
import { FileTypeValidationPipe } from 'src/common/pipes/file-type-validation';
import { FileSizeValidationPipe } from 'src/common/pipes/file-size-validation';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { promises as fs } from 'fs';
import { join } from 'path';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly imageTypeService: ImageTypeService,
  ) {}

  @Get()
  async getImages(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const images = await this.imagesService.getImages(paginationDto);
    const total = await this.imagesService.getTotalImages();
    return new SuccessResponse(images, { total });
  }

  @Get(':id')
  async getImageById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const image = await this.imagesService.getImageById(id);
    if (!image) {
      throw new ValidationException('id', 'Image not found.');
    }
    return new SuccessResponse(image);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images', // folder where files will be saved
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateImage(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) dto: ImageCreateFileDto,
  ): Promise<SuccessResponse> {
    const imageTypeId = parseInt(dto.imageTypeId);
    if (isNaN(imageTypeId)) {
      throw new ValidationException(
        'imageTypeId',
        'imageTypeId must be a number',
      );
    }
    const imageType = await this.imageTypeService.getImageTypeById(imageTypeId);
    if (!imageType) {
      throw new ValidationException(
        'imageTypeId',
        `ImageType with id ${imageTypeId} does not exist.`,
      );
    }
    const image = await this.imagesService.getImageById(id);
    if (!image) {
      throw new ValidationException('id', 'Image not found.');
    }

    // DELETE OLD IMAGE
    if (file && image.bg_img) {
      const oldFilePath = join('./uploads/images', image.bg_img);
      try {
        await fs.access(oldFilePath);
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn(
          `Old image file not found or already deleted: ${oldFilePath}`,
        );
      }
    }
    const data: Prisma.ImageUpdateInput = {
      mainText: dto.mainText,
      subText: dto.subText,
      link: dto.link,
      bg_img: file?.filename ?? null,
      imageType: { connect: { id: imageTypeId } },
    };
    const updatedImage = await this.imagesService.updateImage(id, data);
    return new SuccessResponse(updatedImage);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images', // folder where files will be saved
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFiles(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    file: Express.Multer.File,
    @Body(new ValidationPipe()) dto: ImageCreateFileDto,
  ): Promise<SuccessResponse> {
    const imageTypeId = parseInt(dto.imageTypeId);
    if (isNaN(imageTypeId)) {
      throw new ValidationException(
        'imageTypeId',
        'imageTypeId must be a number',
      );
    }
    const imageType = await this.imageTypeService.getImageTypeById(imageTypeId);
    if (!imageType) {
      throw new ValidationException(
        'imageTypeId',
        `ImageType with id ${imageTypeId} does not exist.`,
      );
    }

    const data: Prisma.ImageCreateInput = {
      mainText: dto.mainText,
      subText: dto.subText,
      link: dto.link,
      bg_img: file?.filename ?? null,
      imageType: { connect: { id: imageTypeId } },
    };

    const image = await this.imagesService.createImage(data);
    return new SuccessResponse(image);
  }

  @Delete(':id')
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const image = await this.imagesService.getImageById(id);
    if (!image) {
      throw new ValidationException('id', 'Image not found.');
    }

    let oldFilePath: string | null = null;
    if (image.bg_img) {
      oldFilePath = join('./uploads/images', image.bg_img);
    }

    if (oldFilePath) {
      try {
        await fs.access(oldFilePath);
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn(
          `Old image file not found or already deleted: ${oldFilePath}`,
        );
      }
    }
    await this.imagesService.deleteImage(id);
    return new SuccessResponse('image', null);
  }
}
