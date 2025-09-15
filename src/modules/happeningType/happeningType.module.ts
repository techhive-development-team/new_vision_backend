import { HappeningsService } from './../happening/happening.service';
import { Module } from '@nestjs/common';
import { HappeningTypeService } from './happeningType.service';
import { HappeningTypeController } from './happeningType.controller';

@Module({
  providers: [HappeningsService, HappeningTypeService],
  controllers: [HappeningTypeController],
})
export class HappeningTypeModule {}
