import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // service
  async getUsers(paginationDto: PaginationDto): Promise<User[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        // createdAt: 'desc',
      },
    });
  }

  async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async getUserByEmailWithId(email: string, id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
        NOT: { id: id },
      },
    });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
