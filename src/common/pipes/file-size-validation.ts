import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private readonly maxSizeInBytes: number = 1024 * 1024) {} // default 1MB

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    if (!value.size) {
      throw new BadRequestException('Invalid file: size not provided.');
    }

    if (value.size > this.maxSizeInBytes) {
      throw new BadRequestException(
        `File too large. Maximum allowed size is ${this.maxSizeInBytes / 1024}KB`,
      );
    }

    return value;
  }
}
