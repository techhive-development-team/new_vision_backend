import { Prisma, StudentReview } from '@prisma/client';
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
} from '@nestjs/common';
import { CreateStudentReviewDto } from './dto/create-studentReview.dto';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { EducationPartnersService } from '../education_partners/education_partners.service';

@Controller('studentReview')
export class StudentReviewController {
  constructor(
    private readonly studentReviewService: StudentReviewService,
    private readonly educationPartnersService: EducationPartnersService,
) {}

  
@Post()
  async createStudentReview(
    @Body(new ValidationPipe()) dto: CreateStudentReviewDto,
  ): Promise<SuccessResponse> {

    const educationPartnerId = parseInt(dto.educationPartnerId);
    if (isNaN(educationPartnerId)) {
      throw new ValidationException(
        'educationPartnerId',
        'educationPartnerId must be a number',
      );
    }

    const educationPartner = await this.educationPartnersService.findOne(educationPartnerId);
    if (!educationPartner) {
      throw new ValidationException(
        'educationPartnerId',
        `EducationPartner with id ${educationPartnerId} does not exist.`,
      );
    }

    console.log(educationPartnerId);

    const data: Prisma.StudentReviewCreateInput = {
      name: dto.name,
      batch: dto.batch,
      review: dto.review,
      educationPartner: { connect: { id: educationPartnerId } },
    };

    console.log(data);
    const review = await this.studentReviewService.createStudentReview(data);
    return new SuccessResponse(review);
  }

  @Get()
  async getStudentReview(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const StudentReview =
      await this.studentReviewService.getStudentReview(paginationDto);
    const total = await this.studentReviewService.getTotalStudentReview();
    return new SuccessResponse(StudentReview, { total });
  }

  @Get(':id')
  async getStudentReviewById(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponse> {
    const review = await this.studentReviewService.getStudentReviewById(id);
    if (!review) {
      throw new ValidationException('id', 'StudentReview not found.');
    }
    return new SuccessResponse(review);
  }

  @Put(':id')
  async updateStudentReview(
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

    const educationPartner = await this.educationPartnersService.findOne(educationPartnerId);
    if (!educationPartner) {
      throw new ValidationException(
        'educationPartnerId',
        `EducationPartner with id ${educationPartnerId} does not exist.`,
      );
    }

    const studentReview = await this.studentReviewService.getStudentReviewById(id);
    if (!studentReview) {
      throw new ValidationException('id', 'StudentReview not found.');
    }

    const data: Prisma.StudentReviewUpdateInput = {
      name: dto.name,
      batch: dto.batch,
      review: dto.review,
      educationPartner: { connect: { id: educationPartnerId } },
    };

    const updatedStudentReview = await this.studentReviewService.updateStudentReview(id, data);
    return new SuccessResponse(updatedStudentReview);
  }

  @Delete(':id')
  async deleteStudentReview(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponse> {
    const studentReview = await this.studentReviewService.getStudentReviewById(id);
    if (!studentReview) {
      throw new ValidationException('id', 'StudentReview not found.');
    }

    await this.studentReviewService.deleteStudentReview(id);
    return new SuccessResponse('StudentReview deleted successfully', null);
  }

}
