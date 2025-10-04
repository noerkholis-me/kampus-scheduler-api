import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KrsService } from './krs.service';
import { CreateKrsDto } from './{dto}/create-krs.dto';
import { UpdateKrsDto } from './{dto}/update-krs.dto';

@ApiTags('krs')
@Controller('krs')
export class KrsController {
  constructor(private krsService: KrsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new KRS (Mahasiswa ambil mata kuliah)' })
  @ApiResponse({ status: 201, description: 'KRS created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (SKS limit exceeded)' })
  @ApiResponse({ status: 404, description: 'Mahasiswa or mata kuliah not found' })
  @ApiResponse({ status: 409, description: 'Already registered for this course' })
  create(@Body() createKrsDto: CreateKrsDto) {
    return this.krsService.create(createKrsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all KRS with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'mahasiswaId', required: false, type: String })
  @ApiQuery({ name: 'tahunAjaran', required: false, type: String })
  @ApiQuery({ name: 'semester', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('mahasiswaId') mahasiswaId?: string,
    @Query('tahunAjaran') tahunAjaran?: string,
    @Query('semester') semester?: string,
    @Query('status') status?: string,
  ) {
    return this.krsService.findAll({ page, limit, mahasiswaId, tahunAjaran, semester, status });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get KRS summary for a mahasiswa' })
  @ApiQuery({ name: 'mahasiswaId', required: true, type: String })
  @ApiQuery({ name: 'tahunAjaran', required: true, type: String })
  @ApiQuery({ name: 'semester', required: true, type: String })
  getSummary(
    @Query('mahasiswaId') mahasiswaId: string,
    @Query('tahunAjaran') tahunAjaran: string,
    @Query('semester') semester: string,
  ) {
    return this.krsService.getSummary(mahasiswaId, tahunAjaran, semester);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get KRS by ID' })
  @ApiResponse({ status: 200, description: 'KRS found' })
  @ApiResponse({ status: 404, description: 'KRS not found' })
  findOne(@Param('id') id: string) {
    return this.krsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update KRS (ubah status/nilai)' })
  @ApiResponse({ status: 200, description: 'KRS updated successfully' })
  @ApiResponse({ status: 404, description: 'KRS not found' })
  update(@Param('id') id: string, @Body() updateKrsDto: UpdateKrsDto) {
    return this.krsService.update(id, updateKrsDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete KRS (drop mata kuliah)' })
  @ApiResponse({ status: 204, description: 'KRS deleted successfully' })
  @ApiResponse({ status: 404, description: 'KRS not found' })
  remove(@Param('id') id: string) {
    return this.krsService.remove(id);
  }
}
