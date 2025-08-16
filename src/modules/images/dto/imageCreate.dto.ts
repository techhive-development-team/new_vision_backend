import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ImageCreateFileDto {
  
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  public mainText: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  public subText?: string;

  @IsNotEmpty()
  public imageTypeId: number;

  @IsOptional()
  @IsString()
  public link?: string;

  bg_img: Express.Multer.File;
  
}
