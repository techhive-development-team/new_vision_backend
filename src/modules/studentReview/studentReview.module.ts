import { Module } from '@nestjs/common';
import { StudentReviewController } from './studentReview.controller';
import { StudentReviewService } from './studentReview.service';
import { EducationPartnersService } from '../education_partners/education_partners.service';

@Module({
  providers: [StudentReviewService, EducationPartnersService],
  controllers: [StudentReviewController],
})
export class StudentReviewModule {}
