import { PartialType } from '@nestjs/mapped-types';
import { CreateHappeningDto } from './create-happening.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateHappeningDto extends PartialType(CreateHappeningDto) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  happeningTypeId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  existingAlbum?: string[];

  @IsOptional()
  @IsString()
  mainImage?: string;
}
