import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { SuccessResponse } from 'src/common/exceptions/success';
import { ValidationException } from 'src/common/exceptions/validation.exception';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  create(@Body() createInquiryDto: CreateInquiryDto) {
    const data: Prisma.InquiryCreateInput = { ...createInquiryDto };
    return this.inquiryService.create(data);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const inquiries = await this.inquiryService.findAll(paginationDto);
    const total = await this.inquiryService.getTotalInquiries();
    return new SuccessResponse(inquiries, { total });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const inquiry = await this.inquiryService.findOne(id);
    if (!inquiry) {
      throw new ValidationException('id', 'Inquiry not found');
    }
    return new SuccessResponse(inquiry);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const inquiry = await this.inquiryService.findOne(id);
    if (!inquiry) {
      throw new ValidationException('id', 'Inquiry not found');
    }
    await this.inquiryService.remove(id);
    return new SuccessResponse('data', null);
  }
}
