import { Module } from '@nestjs/common';
import { HappeningTypeService } from './happeningType.service';
import { HappeningTypeController } from './happeningType.controller';

@Module({
  providers: [HappeningTypeService],
  controllers: [HappeningTypeController],
})
export class HappeningTypeModule {}
