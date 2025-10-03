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
import { JadwalService } from './jadwal.service';
import { CreateJadwalDto } from './{dto}/create-jadwal.dto';
import { UpdateJadwalDto } from './{dto}/update-jadwal.dto';

@ApiTags('jadwal')
@Controller('jadwal')
export class JadwalController {
  constructor(private readonly jadwalService: JadwalService) {}

  @Post()
  @ApiOperation({ summary: 'Create new jadwal' })
  @ApiResponse({ status: 201, description: 'Jadwal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or schedule conflict' })
  @ApiResponse({ status: 404, description: 'Mata kuliah or dosen not found' })
  create(@Body() createJadwalDto: CreateJadwalDto) {
    return this.jadwalService.create(createJadwalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jadwal with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'hari', required: false, type: String })
  @ApiQuery({ name: 'tahunAjaran', required: false, type: String })
  @ApiQuery({ name: 'semester', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('hari') hari?: string,
    @Query('tahunAjaran') tahunAjaran?: string,
    @Query('semester') semester?: string,
  ) {
    return this.jadwalService.findAll({
      page,
      limit,
      hari,
      tahunAjaran,
      semester,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get jadwal by ID' })
  @ApiResponse({ status: 200, description: 'Jadwal found' })
  @ApiResponse({ status: 404, description: 'Jadwal not found' })
  findOne(@Param('id') id: string) {
    return this.jadwalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update jadwal' })
  @ApiResponse({ status: 200, description: 'Jadwal updated successfully' })
  @ApiResponse({ status: 404, description: 'Jadwal not found' })
  update(@Param('id') id: string, @Body() updateJadwalDto: UpdateJadwalDto) {
    return this.jadwalService.update(id, updateJadwalDto);
  }

  @Delete('id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete jadwal' })
  @ApiResponse({ status: 204, description: 'Jadwal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Jadwal not found' })
  remove(@Param('id') id: string) {
    return this.jadwalService.remove(id);
  }
}
