import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ImageTypeModule } from './image-type/image-type.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [UsersModule, ImageTypeModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
