import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEducationPartnerDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  overview: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  location: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  partnerType?: string;

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
