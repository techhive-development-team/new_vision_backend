  import { Module } from '@nestjs/common';
  import { HappeningsService } from './happening.service';
  import { HappeningTypeService } from 'src/modules/happeningType/happeningType.service';
  import { HappeningsController } from './happening.controller';

  @Module({
    providers: [HappeningsService, HappeningTypeService],
    controllers: [HappeningsController],
  })
  export class HappeningsModule {}
