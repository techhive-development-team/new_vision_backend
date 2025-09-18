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
import { CoursesModule } from './modules/courses/courses.module';
import { HappeningTypeModule } from './modules/happeningType/happeningType.module';
import { HappeningsModule } from './modules/happening/happening.module';
import { EducationPartnersModule } from './modules/education_partners/education_partners.module';
import { StudentReviewModule } from './modules/studentReview/studentReview.module';

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
        rootPath: join(__dirname, '..', 'uploads/courses'),
        serveRoot: '/uploads/courses',
      },
      {
        rootPath: join(__dirname, '..', 'uploads/education-partners'),
        serveRoot: '/uploads/education-partners/',
      },
      {
        rootPath: join(__dirname, '..', 'uploads/happenings'),
        serveRoot: '/uploads/happenings',
      },
      {
        rootPath: join(__dirname, '..', 'uploads/studentReview'),
        serveRoot: '/uploads/studentReview',
      },
    ),
    MulterModule.register({
      dest: './uploads/images',
    }),
    UsersModule,
    ImageTypeModule,
    ImagesModule,
    HappeningTypeModule,
    HappeningsModule,
    InquiryModule,
    AuthModule,
    EducationPartnersModule,
    StudentReviewModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
