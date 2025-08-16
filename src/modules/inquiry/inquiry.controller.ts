import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Prisma } from '@prisma/client';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  create(@Body() createInquiryDto: CreateInquiryDto) {
    const data: Prisma.InquiryCreateInput = { ...createInquiryDto };
    return this.inquiryService.create(data);
  }

  @Get()
  findAll() {
    return this.inquiryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
    return this.inquiryService.update(+id, updateInquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiryService.remove(+id);
  }
}
