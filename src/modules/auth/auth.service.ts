import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthenticationException } from 'src/common/exceptions/authentication.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<string> {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (user == null) {
      throw new AuthenticationException(false, 'email', 'Invalid Email.');
    }
    if (user?.password !== loginDto.password) {
      throw new AuthenticationException(false, 'password', 'Invalid Password.');
    }
    const payload = { sub: user.id, username: user.name };
    const jwtToken = await this.jwtService.signAsync(payload);
    return jwtToken;
  }
}
