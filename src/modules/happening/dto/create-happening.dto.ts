
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHappeningDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  public title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  public description: string;

  @IsNotEmpty()
  public happeningTypeId: string;

//   @IsOptional()
//   public mainImage: Express.Multer.File;

//   @IsOptional()
//   public albumId: string;
}
