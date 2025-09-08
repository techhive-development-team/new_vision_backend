import { Module } from '@nestjs/common';
import { ImageTypeService } from './imageType.service';
import { ImageTypeController } from './imageType.controller';
import { ImagesService } from '../images/images.service';

@Module({
  providers: [ImageTypeService, ImagesService],
  controllers: [ImageTypeController],
})
export class ImageTypeModule {}
