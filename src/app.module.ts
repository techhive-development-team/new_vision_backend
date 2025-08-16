import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './config/prisma/prisma.service';
import { UsersModule } from './modules/users/users.module';
import { ImageTypeModule } from './modules/imageType/imageType.module';
import { ImagesModule } from './modules/images/images.module';
import { InquiryModule } from './modules/inquiry/inquiry.module';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'images'),
        serveRoot: '/images',
      },
      {
        rootPath: join(__dirname, '..', 'students'),
        serveRoot: '/students',
      },
    ),
    UsersModule,
    ImageTypeModule,
    ImagesModule,
    InquiryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
