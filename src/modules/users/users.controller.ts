import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { JwtAuthGuard } from 'src/config/jwt/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    const user = await this.usersService.getUserByEmail(userData.email);
    if (user) {
      throw new ValidationException('email', 'Email already exists.');
    }
    return this.usersService.createUser(userData);
  }

  // @Get()
  // getUsers(): Promise<UserModel[]> {
  //   return this.usersService.getUsers();
  // }

  // @Get(':id')
  // getUserById(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<UserModel | null> {
  //   return this.usersService.getUserById(id);
  // }

  // @Put(':id')
  // updateUser(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() userData: Prisma.UserUpdateInput,
  // ): Promise<UserModel> {
  //   return this.usersService.updateUser(id, userData);
  // }

  // @Delete(':id')
  // deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
  //   return this.usersService.deleteUser(id);
  // }
}
