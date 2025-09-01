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
import { EducationPartnersModule } from './modules/education_partners/education_partners.module';


@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'uploads/images'),
        serveRoot: '/images',
      },
      {
        rootPath: join(__dirname, '..', 'uploads/students'),
        serveRoot: '/students',
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
    EducationPartnersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
