import { Injectable } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Inquiry, Prisma } from '@prisma/client';

@Injectable()
export class InquiryService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.InquiryCreateInput): Promise<Inquiry> {
    return this.prisma.inquiry.create({ data });
  }

  findAll(): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} inquiry`;
  }

  update(id: number, updateInquiryDto: UpdateInquiryDto) {
    return `This action updates a #${id} inquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiry`;
  }
}
