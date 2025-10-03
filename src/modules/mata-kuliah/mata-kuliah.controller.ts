import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MataKuliahService } from './mata-kuliah.service';
import { CreateMataKuliahDto } from './{dto}/create-mata-kuliah.dto';
import { UpdateMataKuliahDto } from './{dto}/update-mata-kuliah.dto';

@ApiTags('mata-kuliah')
@Controller('mata-kuliah')
export class MataKuliahController {
  constructor(private readonly mataKuliahService: MataKuliahService) {}

  @Post()
  @ApiOperation({ summary: 'Create new mata kuliah' })
  @ApiResponse({ status: 201, description: 'Mata kuliah created successfully' })
  @ApiResponse({ status: 409, description: 'Kode already exists' })
  create(@Body() createMataKuliahDto: CreateMataKuliahDto) {
    return this.mataKuliahService.create(createMataKuliahDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mata kuliah with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'semester', required: false, type: Number })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('semester') semester?: number,
  ) {
    return this.mataKuliahService.findAll({ page, limit, search, semester });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mata kuliah by ID' })
  @ApiResponse({ status: 200, description: 'Mata kuliah found' })
  @ApiResponse({ status: 404, description: 'Mata kuliah not found' })
  findOne(@Param('id') id: string) {
    return this.mataKuliahService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update mata kuliah' })
  @ApiResponse({ status: 200, description: 'Matakuliah update successfully ' })
  @ApiResponse({ status: 409, description: 'Kode matakuliah already exist  ' })
  update(
    @Param('id') id: string,
    @Body() updateMataKuliahDto: UpdateMataKuliahDto,
  ) {
    return this.mataKuliahService.update(id, updateMataKuliahDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete matakuliah by ID' })
  @ApiResponse({ status: 204, description: 'matakuliah deleted successfully' })
  @ApiResponse({ status: 404, description: 'matakuliah not found' })
  remove(@Param('id') id: string) {
    return this.mataKuliahService.remove(id);
  }
}
