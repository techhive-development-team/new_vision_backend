import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { ImagesService } from './images.service';
import { ImageCreateFileDto } from './dto/create-image.dto';
import {
  FileInterceptor,
} from '@nestjs/platform-express';
import { ImageTypeService } from 'src/modules/imageType/imageType.service';
import { FileTypeValidationPipe } from 'src/common/pipes/file-type-validation';
import { FileSizeValidationPipe } from 'src/common/pipes/file-size-validation';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  ): Promise<Image> {

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

    return this.imagesService.createImage(data);
  }
}
