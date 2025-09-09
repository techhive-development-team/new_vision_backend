import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SuccessResponse } from 'src/common/exceptions/success';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileTypeValidationPipe } from 'src/common/pipes/file-type-validation';
import { FileSizeValidationPipe } from 'src/common/pipes/file-size-validation';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { ValidationException } from 'src/common/exceptions/validation.exception';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/courses',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    image: Express.Multer.File,
    @Body(new ValidationPipe()) createCourseDto: CreateCourseDto,
  ): Promise<SuccessResponse> {
    createCourseDto['image'] = image?.filename;
    const course = await this.coursesService.create(createCourseDto);
    return new SuccessResponse(course);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const courses = await this.coursesService.findAll(paginationDto);
    const total = await this.coursesService.getTotalCourses();
    return new SuccessResponse(courses, { total });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new ValidationException('id', 'Course not found.');
    }
    return new SuccessResponse(course);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @UploadedFile(new FileTypeValidationPipe(), new FileSizeValidationPipe())
    image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateCourseDto: UpdateCourseDto,
  ): Promise<SuccessResponse> {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new ValidationException('id', 'Course not found.');
    }

    if (image && course.image) {
      const oldFilePath = join('./uploads/images', course.image);
      try {
        await fs.access(oldFilePath);
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn(
          `Old image file not found or already deleted: ${oldFilePath}`,
        );
      }
    }
    const updatedCourse = await this.coursesService.update(id, updateCourseDto);
    return new SuccessResponse(updatedCourse);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new ValidationException('id', 'Course not found.');
    }
    const deletedCourse = await this.coursesService.remove(id);
    return new SuccessResponse(deletedCourse);
  }
}
