import { ValidationException } from './../../common/exceptions/validation.exception';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { HappeningTypeService } from './happeningType.service';
import { Prisma, HappeningType as HappeningTypeModel } from '@prisma/client';
import { CreateHappeningTypeDto } from './dto/create-happeningType.dto';
import { SuccessResponse } from 'src/common/exceptions/success';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Controller('happeningTypes')
export class HappeningTypeController {
  constructor(private readonly happeningTypeService: HappeningTypeService) {}

  @Post()
  async createHappeningType(
    @Body(new ValidationPipe()) happeningTypeData: CreateHappeningTypeDto,
  ): Promise<SuccessResponse> {
    const newHappeningType =
      await this.happeningTypeService.createHappeningType(happeningTypeData);
    return new SuccessResponse('data', newHappeningType);
  }

  @Get()
  async getHappeningTypes(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const happeningTypes =
      await this.happeningTypeService.getHappeningTypes(paginationDto);
    const total = await this.happeningTypeService.getTotalHappeningTypes();
    return new SuccessResponse(happeningTypes, { total });
  }

  @Get(':id')
  async getHappeningTypeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const happeningType = await this.happeningTypeService.getHappeningTypeById(
      id,
    );
    if (!happeningType) {
      throw new ValidationException('id', 'Happening type not found.');
    }
    return new SuccessResponse(happeningType);
  }

  @Put(':id')
  async updateHappeningType(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateData: Prisma.HappeningTypeUpdateInput,
  ): Promise<SuccessResponse> {
    const oldHappeningType =
      await this.happeningTypeService.getHappeningTypeById(id);
    if (!oldHappeningType) {
      throw new ValidationException('id', 'Happening type not found.');
    }
    const updatedHappeningType =
      await this.happeningTypeService.updateHappeningType(id, updateData);
    return new SuccessResponse('data', updatedHappeningType);
  }

  @Delete(':id')
  async deleteHappeningType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse> {
    const happeningType = await this.happeningTypeService.getHappeningTypeById(
      id,
    );
    if (!happeningType) {
      throw new ValidationException('id', 'Happening type not found.');
    }
    await this.happeningTypeService.deleteHappeningType(id);
    return new SuccessResponse('data', null);
  }
}
