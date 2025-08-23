import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(field: string, message: string) {
    super({
      statusCode: 400,
      success: false,
      data: [{ field, message }],
    });
  }

  static multiple(errors: { field: string; message: string }[]) {
    return new BadRequestException({
      statusCode: 400,
      success: false,
      data: errors,
    });
  }
}
