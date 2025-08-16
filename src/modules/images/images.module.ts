import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImageTypeService } from 'src/modules/imageType/imageType.service';

@Module({
  providers: [ImagesService, ImageTypeService],
  controllers: [ImagesController],
})
export class ImagesModule {}
