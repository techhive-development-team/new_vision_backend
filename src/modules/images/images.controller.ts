import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { ImagesService } from './images.service';
import { ImageCreateFileDto } from './dto/imageCreate.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageTypeService } from 'src/modules/imageType/imageType.service';
import { FileTypeValidationPipe } from 'src/common/pipes/file-type-validation';
import { FileSizeValidationPipe } from 'src/common/pipes/file-size-validation';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly imageTypeService: ImageTypeService,
  ) {}

  @Get()
  async getImages(): Promise<Image[]> {
    return this.imagesService.getImages();
  }

  @Get('main')
  async getImageGroupBy(): Promise<any> {
    return this.imagesService.getMainImage();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('bg_img'))
  async uploadFiles(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    file: Express.Multer.File,
    @Body(new ValidationPipe()) dto: ImageCreateFileDto,
  ): Promise<Image> {
    return this.imagesService.createImage({
      mainText: dto.mainText,
      subText: dto.subText,
      imageType: { connect: { id: parseInt(dto.imageTypeId.toString()) } },
      link: dto.link,
    });
  }
}
