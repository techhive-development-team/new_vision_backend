
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreateEducationPartnerDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString())
  overview: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString())
  location: string;

  @IsOptional()
  @IsString()
  partnerType?: string;

  @IsOptional()
  @IsString()
  foundedDate?: string;

  // file fields handled separately
  @IsOptional()
  bg_img?: string;

  @IsOptional()
  logo_img?: string;
}


