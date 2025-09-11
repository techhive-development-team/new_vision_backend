import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { CreateEducationPartnerDto } from './dto/create-education_partner.dto';
import { UpdateEducationPartnerDto } from './dto/update-education_partner.dto';
import { EducationPartner , Prisma } from '@prisma/client';

@Injectable()
export class EducationPartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EducationPartnerCreateInput): Promise<EducationPartner> {
    return this.prisma.educationPartner.create({data}); 
  }

  async findAll(): Promise<EducationPartner[]> {
    return this.prisma.educationPartner.findMany({
      include: { StudentReview: true}, 
    });
  }

  async findOne(id: number): Promise<EducationPartner> {
    const partner = await this.prisma.educationPartner.findUnique({
      where: {id},
      include: {StudentReview: true},
    });
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
      return partner;
  }

  async findByOverview(overview: string): Promise<EducationPartner | null> {
    return this.prisma.educationPartner.findFirst({
      where: { overview },
    });
  }

  async update(
    id: number,
    data: Prisma.EducationPartnerUpdateInput,
  ): Promise<EducationPartner> {
    await this.findOne(id); 
    return this.prisma.educationPartner.update({
      where: {id},
      data,
    });
  }
  
  async remove(id: number): Promise<EducationPartner> {
    await this.findOne(id);
    return this.prisma.educationPartner.delete({
      where: {id},
    });
  }

}