import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(field: string, message: string) {
    super({
      statusCode: 400,
      error: 'Validation Error',
      data: [{ field, message }],
    });
  }

  static multiple(errors: { field: string; message: string }[]) {
    return new BadRequestException({
      statusCode: 400,
      error: 'Validation Error',
      data: errors,
    });
  }
}
