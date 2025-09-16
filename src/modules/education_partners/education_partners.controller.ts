import {
  Controller,
  Post,
  Param,
  Get,
  Body,
  ValidationPipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EducationPartnersService } from './education_partners.service';
import { CreateEducationPartnerDto } from './dto/create-education_partner.dto';
import { UpdateEducationPartnerDto } from './dto/update-education_partner.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Controller('education-partners')
export class EducationPartnersController {
  constructor(
    private readonly educationPartnersService: EducationPartnersService,
  ) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const partners = await this.educationPartnersService.findAll(paginationDto);
    const total = await this.educationPartnersService.findtotal();
    return new SuccessResponse(partners, { total });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const partner = await this.educationPartnersService.findOne(id);
    if (!partner) {
      throw new ValidationException('id', 'EducationPartner not found.');
    }
    return new SuccessResponse(partner);
  }

  @Get('/front/institute')
  async getPartnerInstitute(): Promise<SuccessResponse> {
    const partner =
      await this.educationPartnersService.getPartnerByType('INSTITUTE');
    return new SuccessResponse(partner);
  }

  @Get('/front/university')
  async getPartnerYniversity(): Promise<SuccessResponse> {
    const partner =
      await this.educationPartnersService.getPartnerByType('UNIVERSITY');
    return new SuccessResponse(partner);
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo_img', maxCount: 1 },
        { name: 'bg_img', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/education-partners',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async createWithFiles(
    @UploadedFiles()
    files: { logo_img?: Express.Multer.File[]; bg_img?: Express.Multer.File[] },
    @Body(new ValidationPipe()) createDto: CreateEducationPartnerDto,
  ): Promise<SuccessResponse> {
    if (!files.logo_img || !files.logo_img[0]) {
      throw new ValidationException('logo_img', 'Logo image is required.');
    }
    if (!files.bg_img || !files.bg_img[0]) {
      throw new ValidationException('bg_img', 'Background image is required.');
    }

    const data: Prisma.EducationPartnerCreateInput = {
      ...createDto,
      logo_img: files.logo_img[0].filename,
      bg_img: files.bg_img[0].filename,
    };
    const partner = await this.educationPartnersService.create(data);

    return new SuccessResponse(partner);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo_img', maxCount: 1 },
        { name: 'bg_img', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/education-partners',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async update(
    @UploadedFiles()
    files: { logo_img?: Express.Multer.File[]; bg_img?: Express.Multer.File[] },
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateDto: UpdateEducationPartnerDto,
  ): Promise<SuccessResponse> {
    const partner = await this.educationPartnersService.findOne(id);
    if (!partner) {
      throw new ValidationException(
        'id',
        `EducationPartner with ID ${id} not found.`,
      );
    }

    const fs = require('fs').promises;
    const path = require('path');

    const logo_img_filename = files.logo_img?.[0]?.filename;
    if (
      logo_img_filename &&
      partner.logo_img &&
      logo_img_filename !== partner.logo_img
    ) {
      const oldLogoPath = path.join(
        './uploads/education-partners',
        partner.logo_img,
      );
      try {
        await fs.access(oldLogoPath);
        await fs.unlink(oldLogoPath);
      } catch (err) {
        console.warn(
          `Old logo file not found or already deleted: ${oldLogoPath}`,
        );
      }
    }

    const bg_img_filename = files.bg_img?.[0]?.filename;
    if (
      bg_img_filename &&
      partner.bg_img &&
      bg_img_filename !== partner.bg_img
    ) {
      const oldBgPath = path.join(
        './uploads/education-partners',
        partner.bg_img,
      );
      try {
        await fs.access(oldBgPath);
        await fs.unlink(oldBgPath);
      } catch (err) {
        console.warn(
          `Old background file not found or already deleted: ${oldBgPath}`,
        );
      }
    }

    const data: Prisma.EducationPartnerUpdateInput = {
      ...updateDto,
      logo_img: logo_img_filename ?? partner.logo_img ?? null,
      bg_img: bg_img_filename ?? partner.bg_img ?? null,
    };

    const updatedPartner = await this.educationPartnersService.update(id, data);
    return new SuccessResponse(updatedPartner);
  }

  @Delete(':id')
  async removeEventListener(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const partner = await this.educationPartnersService.findOne(id);
    if (!partner) {
      throw new ValidationException(
        'id',
        `EducationPartner with ID ${id} not found.`,
      );
    }
    const fs = require('fs').promises;
    const path = require('path');

    if (partner.logo_img) {
      const logoPath = path.join(
        './uploads/education-partners',
        partner.logo_img,
      );
      try {
        await fs.access(logoPath);
        await fs.unlink(logoPath);
      } catch (err) {
        console.warn(`Old logo file not found or already deleted: ${logoPath}`);
      }
    }
    if (partner.bg_img) {
      const bgPath = path.join('./uploads/education-partners', partner.bg_img);
      try {
        await fs.access(bgPath);
        await fs.unlink(bgPath);
      } catch (err) {
        console.warn(
          `Old background file not found or already deleted: ${bgPath}`,
        );
      }
    }

    await this.educationPartnersService.remove(id);
    return new SuccessResponse('educationPartner', 'Deleted successfully');
  }
}
