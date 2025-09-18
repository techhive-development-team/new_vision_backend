import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateStudentReviewDto {

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value?.trim())
    public name: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value})=> value?.trim())
    public batch: string;

    @IsOptional()
    public student_img: Express.Multer.File;

    @IsNotEmpty()
    public educationPartnerId: string;

    @IsOptional()
    public review: string;

}

