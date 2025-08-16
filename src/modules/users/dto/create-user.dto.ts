import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  public name: string;
  @IsNotEmpty()
  public password: string;
  @IsNotEmpty()
  public email: string;
}
