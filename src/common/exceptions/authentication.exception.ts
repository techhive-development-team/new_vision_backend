import { UnauthorizedException } from '@nestjs/common';

export class AuthenticationException extends UnauthorizedException {
  constructor(success: boolean, field: string, message: string) {
    super({
      statusCode: 401,
      success: success,
      data: [{ field, message }],
    });
  }
}
