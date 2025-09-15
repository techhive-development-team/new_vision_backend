import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
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

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  foundedDate?: string;

  // file fields handled separately
  @IsOptional()
  bg_img?: Express.Multer.File;

  @IsOptional()
  logo_img?: Express.Multer.File;
}
