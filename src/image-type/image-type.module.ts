import { Module } from '@nestjs/common';
import { ImageTypeService } from './image-type.service';
import { ImageTypeController } from './image-type.controller';

@Module({
  providers: [ImageTypeService],
  controllers: [ImageTypeController]
})
export class ImageTypeModule {}
