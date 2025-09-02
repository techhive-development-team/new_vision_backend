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
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'uploads/images'),
        serveRoot: '/uploads/images',
      },
      {
        rootPath: join(__dirname, '..', 'uploads/students'),
        serveRoot: '/uploads/students',
      },
    ),
    MulterModule.register({
      dest: './uploads/images',
    }),
    UsersModule,
    ImageTypeModule,
    ImagesModule,
    InquiryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
