import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }

  @Get()
  getUsers(): Promise<UserModel[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserModel | null> {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Prisma.UserUpdateInput,
  ): Promise<UserModel> {
    return this.usersService.updateUser(id, userData);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    return this.usersService.deleteUser(id);
  }
}
