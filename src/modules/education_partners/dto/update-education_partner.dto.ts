import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationPartnerDto } from './create-education_partner.dto';

export class UpdateEducationPartnerDto extends PartialType(CreateEducationPartnerDto) {}
