import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SuccessResponse } from 'src/common/exceptions/success';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ): Promise<SuccessResponse> {
    const accessToken = await this.authService.signIn(loginDto);
    return new SuccessResponse('access_token', accessToken);
  }
}
