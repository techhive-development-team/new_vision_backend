import { UnauthorizedException } from '@nestjs/common';

export class AuthenticationException extends UnauthorizedException {
  constructor(field: string, message: string) {
    super({
      statusCode: 403,
      error: 'Unauthorized',
      data: [{ field, message }],
    });
  }
}
