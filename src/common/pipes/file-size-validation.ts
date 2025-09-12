import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private readonly maxSizeInBytes: number = 1024 * 1024 * 30) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    if (value.size > this.maxSizeInBytes) {
      throw new ValidationException(
        'file',
        `File too large. Maximum allowed size is ${this.maxSizeInBytes / 1024}KB`,
      );
    }

    return value;
  }
}
