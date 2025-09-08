import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
  IsInt,
  IsArray,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  public name: string;

  @IsString()
  @IsNotEmpty()
  public programOverview: string;

  @IsOptional()
  @IsString()
  public quiz?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public skills?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  public price?: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  public duration: string;

  @IsString()
  @IsNotEmpty()
  public location: string;

  @IsString()
  @IsNotEmpty()
  public level: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  public isOpened?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public expireDate?: Date;
}
