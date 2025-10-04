import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateKrsDto {
  @ApiProperty({ example: 'uuid-mahasiswa', description: 'ID Mahasiswa' })
  @IsUUID('4', { message: 'mahasiswaId harus UUID yang valid' })
  mahasiswaId: string;

  @ApiProperty({ example: 'uuid-mata-kuliah', description: 'ID Mata Kuliah' })
  @IsUUID('4', { message: 'matakuliahId harus UUID yang valid' })
  mataKuliahId: string;

  @ApiProperty({ example: '2024/2025', description: 'Tahun ajaran' })
  @IsString()
  @Matches(/^\d{4}\/\d{4}$/, {
    message: 'tahunAjaran harus dalam format YYYY/YYYY (contoh: 2024/2025)',
  })
  tahunAjaran: string;

  @ApiProperty({
    example: 'Ganjil',
    description: 'Semester',
    enum: ['Ganjil', 'Genap'],
  })
  @IsIn(['Ganjil', 'Genap'], {
    message: 'Semester harus Ganjil atau Genap',
  })
  semester: string;

  @ApiProperty({
    example: 'AKTIF',
    description: 'Status KRS',
    enum: ['AKTIF', 'LULUS', 'MENGULANG', 'DROP'],
    required: false,
    default: 'AKTIF',
  })
  @IsOptional()
  @IsIn(['AKTIF', 'LULUS', 'MENGULANG', 'DROP'], {
    message: 'Status harus salah satu dari AKTIF, LULUS, MENGULANG, DROP',
  })
  status?: string;

  @ApiProperty({
    example: 'A',
    description: 'Nilai Akhir',
    enum: ['A', 'B+', 'B', 'C+', 'C', 'D', 'E '],
    required: false,
  })
  @IsOptional()
  @IsIn(['A', 'B+', 'B', 'C+', 'C', 'D', 'E'], {
    message: 'Nilai harus salah satu dari: A, B+, B, C+, C, D, E',
  })
  nilai: string;
}
