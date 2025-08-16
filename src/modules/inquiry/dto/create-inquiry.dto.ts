import { IsNotEmpty } from 'class-validator';

export class CreateInquiryDto {

  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public email: string;
  
  public phone: string;
  
  @IsNotEmpty()
  public description: string;
}
