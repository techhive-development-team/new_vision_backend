import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthenticationException } from 'src/common/exceptions/authentication.exception';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<string> {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new AuthenticationException(false, 'email', 'Invalid Email.');
    }
    const isPasswordValid = await argon2.verify(
      user.password,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new AuthenticationException(false, 'password', 'Invalid Password.');
    }
    const payload = { sub: user.id, username: user.name };
    const jwtToken = await this.jwtService.signAsync(payload);
    return jwtToken;
  }
}
