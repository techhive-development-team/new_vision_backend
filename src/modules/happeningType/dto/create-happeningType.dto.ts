import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHappeningTypeDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  public typeName: string;
}
