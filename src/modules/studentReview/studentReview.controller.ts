import { Prisma } from '@prisma/client';
import { StudentReviewService } from './studentReview.service';
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateStudentReviewDto } from './dto/create-studentReview.dto';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { EducationPartnersService } from '../education_partners/education_partners.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileTypeValidationPipe } from 'src/common/pipes/file-type-validation';
import { FileSizeValidationPipe } from 'src/common/pipes/file-size-validation';
import { promises as fs } from 'fs';

@Controller('studentReview')
export class StudentReviewController {
  constructor(
    private readonly studentReviewService: StudentReviewService,
    private readonly educationPartnersService: EducationPartnersService,
  ) {}

  @Get()
  async getStudentReview(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const reviews =
      await this.studentReviewService.getStudentReview(paginationDto);
    const total = await this.studentReviewService.getTotalStudentReview();

    return new SuccessResponse(reviews, { total });
  }

  @Get(':id')
  async getStudentReviewById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const review = await this.studentReviewService.getStudentReviewById(id);
    return new SuccessResponse(review);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('student_img', {
      storage: diskStorage({
        destination: './uploads/studentReview',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createStudentReview(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    student_img: Express.Multer.File,
    @Body(new ValidationPipe()) dto: CreateStudentReviewDto,
  ): Promise<SuccessResponse> {
    const educationPartnerId = parseInt(dto.educationPartnerId);
    if (isNaN(educationPartnerId)) {
      throw new ValidationException(
        'educationPartnerId',
        'educationPartnerId must be a number',
      );
    }

    const educationPartner =
      await this.educationPartnersService.findOne(educationPartnerId);
    if (!educationPartner) {
      throw new ValidationException(
        'educationPartnerId',
        `EducationPartner with id ${educationPartnerId} does not exist.`,
      );
    }
    const data: Prisma.StudentReviewCreateInput = {
      name: dto.name,
      batch: dto.batch,
      student_img: student_img?.filename ?? null,
      review: dto.review,
      educationPartner: { connect: { id: educationPartnerId } },
    };

    const review = await this.studentReviewService.createStudentReview(data);
    return new SuccessResponse(review);
  }
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('student_img', {
      storage: diskStorage({
        destination: './uploads/studentReview',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateStudentReview(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    student_img: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) dto: CreateStudentReviewDto,
  ): Promise<SuccessResponse> {
    const educationPartnerId = parseInt(dto.educationPartnerId);
    if (isNaN(educationPartnerId)) {
      throw new ValidationException(
        'educationPartnerId',
        'educationPartnerId must be a number',
      );
    }

    const educationPartner =
      await this.educationPartnersService.findOne(educationPartnerId);
    if (!educationPartner) {
      throw new ValidationException(
        'educationPartnerId',
        `EducationPartner with id ${educationPartnerId} does not exist.`,
      );
    }

    const student = await this.studentReviewService.getStudentReviewById(id);
    if (!student) {
      throw new ValidationException('id', 'Student Review not found.');
    }

    if (
      student_img?.filename &&
      student.student_img &&
      student_img.filename !== student.student_img
    ) {
      const oldFilePath = join('./uploads/studentReview', student.student_img);
      try {
        await fs.access(oldFilePath);
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn(
          `Old Student Review file not found or already deleted: ${oldFilePath},`,
        );
      }
    }

    const data: Prisma.StudentReviewUpdateInput = {
      name: dto.name,
      batch: dto.batch,
      review: dto.review,
      student_img: student_img?.filename ?? student.student_img ?? null,
      educationPartner: { connect: { id: educationPartnerId } },
    };
    const updatedStudentReview =
      await this.studentReviewService.updateStudentReview(id, data);
    return new SuccessResponse(updatedStudentReview);
  }

  @Delete(':id')
  async deleteStudentReview(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const student = await this.studentReviewService.getStudentReviewById(id);
    if (!student) {
      throw new ValidationException('id', 'Student Review not found.');
    }

    let oldFilePath: string | null = null;
    if (student.student_img) {
      oldFilePath = join('./uploads/studentReview', student.student_img);
    }

    if (oldFilePath) {
      try {
        await fs.access(oldFilePath);
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn(
          `Old Student Review file not found or already deleted: ${oldFilePath},`,
        );
      }
    }
    await this.studentReviewService.deleteStudentReview(id);
    return new SuccessResponse('StudentReview deleted successfully', null);
  }
}
