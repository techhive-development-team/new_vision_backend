import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PartnerType } from '@prisma/client';

export class CreateEducationPartnerDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  overview: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  location: string;

  @IsEnum(PartnerType, {
    message: 'partnerType must be INSTITUTE, UNIVERSITY, or COLLEGE',
  })
  partnerType: PartnerType;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  foundedDate: string;

  bg_img?: Express.Multer.File;
  logo_img?: Express.Multer.File;
}
