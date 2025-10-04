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
import { DosenService } from './dosen.service';
import { CreateDosenDto } from './{dto}/create-dosen.dto';
import { UpdateDosenDto } from './{dto}/update-dosen.dto';

@ApiTags('dosen')
@Controller('dosen')
export class DosenController {
  constructor(private readonly dosenService: DosenService) {}

  @Post()
  @ApiOperation({ summary: 'Create new dosen' })
  @ApiResponse({ status: 201, description: 'Dosen created successfully' })
  @ApiResponse({ status: 409, description: 'NIP or email already exists' })
  create(@Body() createDosenDto: CreateDosenDto) {
    return this.dosenService.create(createDosenDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dosen with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.dosenService.findAll({ page, limit, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dosen by ID' })
  @ApiResponse({ status: 200, description: 'Dosen data found successfully' })
  @ApiResponse({ status: 404, description: 'Dosen not found' })
  findOne(@Param('id') id: string) {
    return this.dosenService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update dosen by ID' })
  @ApiResponse({ status: 204, description: 'Dosen update successfully' })
  @ApiResponse({ status: 409, description: 'NIP or email already exists' })
  @ApiResponse({ status: 404, description: 'Dosen not found' })
  update(@Param('id') id: string, @Body() updateDosenDto: UpdateDosenDto) {
    return this.dosenService.update(id, updateDosenDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete dosen by ID' })
  @ApiResponse({ status: 204, description: 'Dosen deleted successfully' })
  @ApiResponse({ status: 404, description: 'Dosen not found' })
  remove(@Param('id') id: string) {
    return this.dosenService.remove(id);
  }
}
