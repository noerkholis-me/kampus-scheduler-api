import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MahasiswaService } from './mahasiswa.service';
import { CreateMahasiswaDto } from './{dto}/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './{dto}/update-mahasiswa.dto';

@ApiTags('mahasiswa')
@Controller('mahasiswa')
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) {}

  @Post()
  @ApiOperation({ summary: 'Create new Mahasiswa' })
  @ApiResponse({ status: 201, description: 'Mahasiswa created successfully' })
  @ApiResponse({ status: 409, description: 'NIM or email already exists' })
  create(@Body() createMahasiswaDto: CreateMahasiswaDto) {
    return this.mahasiswaService.create(createMahasiswaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mahasiswa with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.mahasiswaService.findAll({ page, limit, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mahasiswa by ID' })
  @ApiResponse({
    status: 200,
    description: 'mahasiswa data found successfully',
  })
  @ApiResponse({ status: 404, description: 'mahasiswa not found' })
  findOne(@Param('id') id: string) {
    return this.mahasiswaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update mahasiswa by ID' })
  @ApiResponse({ status: 204, description: 'mahasiswa update successfully' })
  @ApiResponse({ status: 409, description: 'NIP or email already exists' })
  @ApiResponse({ status: 404, description: 'mahasiswa not found' })
  update(
    @Param('id') id: string,
    @Body() updateMahasiswaDto: UpdateMahasiswaDto,
  ) {
    return this.mahasiswaService.update(id, updateMahasiswaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete mahasiswa by ID' })
  @ApiResponse({ status: 204, description: 'mahasiswa deleted successfully' })
  @ApiResponse({ status: 404, description: 'mahasiswa not found' })
  remove(@Param('id') id: string) {
    return this.mahasiswaService.remove(id);
  }
}
