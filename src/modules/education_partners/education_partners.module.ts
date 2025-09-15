import { Module } from '@nestjs/common';
import { EducationPartnersService } from './education_partners.service';
import { EducationPartnersController } from './education_partners.controller';

@Module({
  controllers: [EducationPartnersController],
  providers: [EducationPartnersService],
})
export class EducationPartnersModule {}
