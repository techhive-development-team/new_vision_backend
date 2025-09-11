// happenings.controller.ts
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
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { promises as fs } from 'fs';
import { Prisma } from '@prisma/client';
import { HappeningsService } from './happening.service';
import { HappeningTypeService } from 'src/modules/happeningType/happeningType.service';
import { CreateHappeningDto } from './dto/create-happening.dto';
import { FileTypeValidationPipe } from 'src/common/pipes/file-type-validation';
import { FileSizeValidationPipe } from 'src/common/pipes/file-size-validation';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';

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
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/happenings',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadHappening(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    file: Express.Multer.File,
    @Body(new ValidationPipe()) dto: CreateHappeningDto,
  ): Promise<SuccessResponse> {
    if (!file) throw new ValidationException('file', 'File is required');

    const happeningTypeId = parseInt(dto.happeningTypeId);
    if (isNaN(happeningTypeId))
      throw new ValidationException(
        'happeningTypeId',
        'happeningTypeId must be a number',
      );

    const happeningType =
      await this.happeningTypeService.getHappeningTypeById(happeningTypeId);
    if (!happeningType)
      throw new ValidationException(
        'happeningTypeId',
        `HappeningType with id ${happeningTypeId} does not exist`,
      );

    const data: Prisma.HappeningCreateInput = {
      title: dto.title,
      description: dto.description,
      mainImage: file?.filename,
      happeningType: { connect: { id: happeningTypeId } },
      album: { connect: { id: 1 } }, // default album
    };

    const happening = await this.happeningsService.createHappening(data);
    return new SuccessResponse(happening);
  }

  @Put(':id')
  async updateHappening(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) dto: Prisma.HappeningUpdateInput,
  ): Promise<SuccessResponse> {
    const updated = await this.happeningsService.updateHappening(id, dto);
    return new SuccessResponse(updated);
  }

  @Delete(':id')
  async deleteHappening(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    await this.happeningsService.deleteHappening(id);
    return new SuccessResponse('Happening deleted', null);
  }
}
