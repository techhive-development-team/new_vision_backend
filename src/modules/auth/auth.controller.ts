import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SuccessResponse } from 'src/common/exceptions/success';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ): Promise<SuccessResponse> {
    const accessToken = await this.authService.signIn(loginDto);
    return new SuccessResponse(accessToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('verify-token')
  validate(@Req() req) {
    return new SuccessResponse(req.user);
  }
}
