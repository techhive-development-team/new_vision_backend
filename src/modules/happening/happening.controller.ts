import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Prisma } from '@prisma/client';
import { HappeningsService } from './happening.service';
import { HappeningTypeService } from 'src/modules/happeningType/happeningType.service';
import { CreateHappeningDto } from './dto/create-happening.dto';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { promises as fs } from 'fs';
import { UpdateHappeningDto } from './dto/update-happening.dto';

@Controller('happenings')
export class HappeningsController {
  constructor(
    private readonly happeningsService: HappeningsService,
    private readonly happeningTypeService: HappeningTypeService,
  ) {}

  @Get()
  async getHappenings(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const happenings =
      await this.happeningsService.getHappenings(paginationDto);
    const total = await this.happeningsService.getTotalHappenings();
    return new SuccessResponse(happenings, { total });
  }

  @Get(':id')
  async getHappeningById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const happening = await this.happeningsService.getHappeningById(id);
    if (!happening) throw new ValidationException('id', 'Happening not found.');
    return new SuccessResponse(happening);
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'album_images', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/happenings',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async uploadHappening(
    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      album_images?: Express.Multer.File[];
    },
    @Body(new ValidationPipe()) dto: CreateHappeningDto,
  ): Promise<SuccessResponse> {
    const oldHappeningTypeId = parseInt(dto.happeningTypeId);
    if (isNaN(oldHappeningTypeId)) {
      throw new ValidationException(
        'happeningTypeId',
        'happeningTypeId must be a number',
      );
    }
    const happeningType =
      await this.happeningTypeService.getHappeningTypeById(oldHappeningTypeId);
    if (!happeningType) {
      throw new ValidationException(
        'happeningTypeId',
        `happeningTypeId with id ${happeningType} does not exist.`,
      );
    }
    const bgImage = files.mainImage?.[0];
    const albumImages = files.album_images?.map((f) => f.filename) || [];
    if (!bgImage) throw new ValidationException('mainImage', 'File is required');
    const happeningTypeId = parseInt(dto.happeningTypeId);
    const album = await this.happeningsService.createHappeningAlbum();
    if (albumImages.length > 0) {
      await this.happeningsService.createHappeningImages(album.id, albumImages);
    }
    const happening = await this.happeningsService.createHappening({
      title: dto.title,
      description: dto.description,
      mainImage: bgImage.filename,
      happeningTypeId,
      albumId: album.id,
    });
    return new SuccessResponse(happening);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'album_images', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/happenings',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async updateHappening(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) dto: UpdateHappeningDto,
    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      album_images?: Express.Multer.File[];
    },
  ): Promise<SuccessResponse> {
    //Validate Happening Type
    const happeningTypeId = parseInt(dto.happeningTypeId);
    if (isNaN(happeningTypeId)) {
      throw new ValidationException(
        'happeningTypeId',
        'happeningTypeId must be a number',
      );
    }
    const happeningType =
      await this.happeningTypeService.getHappeningTypeById(happeningTypeId);
    if (!happeningType) {
      throw new ValidationException(
        'happeningTypeId',
        `happeningTypeId with id ${happeningTypeId} does not exist.`,
      );
    }

    //Validate Happening
    const happening = await this.happeningsService.getHappeningById(id);
    if (!happening) {
      throw new ValidationException('id', 'Happening not found');
    }

    // Determine which images were removed
    const existingAlbum: string[] = dto.existingAlbum || [];
    const removedImages = happening.album.images
      .map((img) => img.image)
      .filter((imgName) => !existingAlbum.includes(imgName));
    if (removedImages.length > 0) {
      await this.happeningsService.deleteHappeningImages(
        happening.album.id,
        removedImages,
      );
    }

    const newFiles = files.album_images?.map((f) => f.filename) || [];
    if (newFiles.length > 0) {
      await this.happeningsService.createHappeningImages(
        happening.album.id,
        newFiles,
      );
    }

    const updated = await this.happeningsService.updateHappening(id, {
      title: dto.title,
      description: dto.description,
      mainImage: files.mainImage?.[0]?.filename || happening.mainImage,
      happeningType: {
        connect: { id: happeningTypeId },
      },
    });

    return new SuccessResponse(updated);
  }

  @Delete(':id')
  async deleteHappening(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const happening = await this.happeningsService.getHappeningById(id);

    if (!happening) {
      throw new ValidationException('id', 'Happening not found.');
    }
    const happeningWithAlbum = happening as typeof happening & {
      album?: { id: number; images: { id: number; image: string }[] };
    };

    if (happeningWithAlbum.mainImage) {
      const mainImagePath = join(
        './uploads/happenings',
        happeningWithAlbum.mainImage,
      );
      try {
        await fs.access(mainImagePath);
        await fs.unlink(mainImagePath);
      } catch {
        console.warn(`Main image not found or already deleted: ${mainImagePath}`);
      }
    }

    if (happeningWithAlbum.album?.images?.length) {
      for (const img of happeningWithAlbum.album.images) {
        const imgPath = join('./uploads/happenings', img.image);
        try {
          await fs.access(imgPath);
          await fs.unlink(imgPath);
        } catch {
          console.warn(`Album image not found or already deleted: ${imgPath}`);
        }
      }
    }
    await this.happeningsService.deleteHappening(id);
    return new SuccessResponse('Happening deleted successfully', null);
  }
}
