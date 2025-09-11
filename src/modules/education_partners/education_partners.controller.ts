import {
  Controller,
  Post,
  Patch,
  Param,
  Get,
  Body,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { EducationPartner, Prisma } from '@prisma/client';
import { EducationPartnersService } from './education_partners.service';
import { CreateEducationPartnerDto } from './dto/create-education_partner.dto';
import { UpdateEducationPartnerDto } from './dto/update-education_partner.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/config/jwt/jwt-auth.guard';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { SuccessResponse } from 'src/common/exceptions/success';

@Controller('education-partners')
export class EducationPartnersController {
  constructor(
    private readonly educationPartnersService: EducationPartnersService,
  ) {}

  @Get()
  async findAll(): Promise<EducationPartner[]> {
    return this.educationPartnersService.findAll();
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo_img', maxCount: 10 },
        { name: 'bg_img', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/education-partners',
          filename: (req, file, callback) => {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const random = Math.floor(Math.random() * 1e6);
            const ext = extname(file.originalname);
            const uniqueName = `${file.fieldname}-${timestamp}-${random}${ext}`;
            callback(null, uniqueName);
          },
        }),
      },
    ),
  )
  async createWithFiles(
    @UploadedFiles()
    files: { logo_img?: Express.Multer.File[]; bg_img?: Express.Multer.File[] },
    @Body(new ValidationPipe()) createDto: CreateEducationPartnerDto,
  ) {
    const data = {
      ...createDto,
      logo_img: files.logo_img?.[0]?.filename ?? null,
      bg_img: files.bg_img?.[0]?.filename ?? null,
    };
    return this.educationPartnersService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EducationPartner> {
    return this.educationPartnersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {name: 'logo_img', maxCount:1},
       { name: 'bg_img', maxCount:1},  
      ],
      {
        storage: diskStorage({
          destination: './uploads/education-partners',
          filename: (req, file, callback) => {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const ext = extname(file.originalname);
            const uniqueName = `${file.fieldname}-${timestamp}-${ext}`;
            callback(null, uniqueName);
          },
        }),
      },
    )
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: { logo_img?: Express.Multer.File[]; bg_img?: Express.Multer.File[]},
    @Body(new ValidationPipe()) updateDto: UpdateEducationPartnerDto,
  ): Promise<EducationPartner> {
    const data = {
      ...updateDto,
      logo_img: files.logo_img?.[0]?.filename ?? undefined,
      bg_img: files.bg_img?.[0]?.filename ?? undefined,
    };
    return this.educationPartnersService.update(id, data);
  }

  @Delete(':id')
  async removeEventListener(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponse>{
    const educationPartner = this.educationPartnersService.remove(id);
    return new SuccessResponse("Message", "educationPartner  deleted successfull" );
  }
  
}


