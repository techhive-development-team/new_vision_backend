import { Module } from '@nestjs/common';
import { ImageTypeService } from './imageType.service';
import { ImageTypeController } from './imageType.controller';

@Module({
  providers: [ImageTypeService],
  controllers: [ImageTypeController]
})
export class ImageTypeModule {}
