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
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User as UserModel } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<SuccessResponse> {
    const user = await this.usersService.getUserByEmail(userData.email);
    if (user) {
      throw new ValidationException('email', 'Email already exists.');
    }
    const newUser = await this.usersService.createUser(userData);
    return new SuccessResponse('data', newUser);
  }

  @Get()
  async getUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const users = await this.usersService.getUsers(paginationDto);
    const total = await this.usersService.getTotalUsers();
    return new SuccessResponse(users, { total });
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse | null> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new ValidationException('id', 'User not found.');
    }
    return new SuccessResponse(user);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Prisma.UserUpdateInput,
  ): Promise<SuccessResponse | null> {
    const oldUser = await this.usersService.getUserById(id);
    if (!oldUser) {
      throw new ValidationException('id', 'User not found.');
    }
    const user = await this.usersService.getUserByEmailWithId(
      userData.email as string,
      id,
    );
    if (user) {
      throw new ValidationException('email', 'Email already exists.');
    }
    const updatedUser = await this.usersService.updateUser(id, userData);
    return new SuccessResponse('data', updatedUser);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new ValidationException('id', 'User not found.');
    }
    await this.usersService.deleteUser(id);
    return new SuccessResponse('data', null);
  }
}
