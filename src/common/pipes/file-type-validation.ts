import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  constructor(
    private readonly allowedExtensions: string[] = ['.png', '.jpeg', '.jpg'],
  ) {}

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) {
      return value;
    }

    const extension = extname(value.originalname).toLowerCase();

    if (!this.allowedExtensions.includes(extension)) {
      throw new ValidationException(
        'file',
        `File type ${extension} not supported. Allowed types: ${this.allowedExtensions.join(', ')}`,
      );
    }

    return value;
  }
}
