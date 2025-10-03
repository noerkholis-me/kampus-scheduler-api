import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID, Matches } from 'class-validator';

export class CreateJadwalDto {
  @ApiProperty({ example: 'uuid-matakuliah', description: 'ID mata kuliah' })
  @IsUUID(4, { message: 'mataKuliahId harus UUID yang valid' })
  mataKuliahId: string;

  @ApiProperty({ example: 'uuid-dosen', description: 'ID dosen' })
  @IsUUID(4, { message: 'dosenId harus UUID yang valid' })
  dosenId: string;

  @ApiProperty({
    example: 'senin',
    description: 'hari',
    enum: ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'],
  })
  @IsIn(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'], {
    message:
      'Hari harus salah satu dari: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu',
  })
  hari: string;

  @ApiProperty({ example: '12:00', description: 'Jam mulai (format: HH:MM)' })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'jamMulai harus dalam format HH:MM (24 jam)',
  })
  jamMulai: string;

  @ApiProperty({ example: '15:00', description: 'Jam Selesai (format: HH:MM)' })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'jamSelesai harus dalam format HH:MM (24 jam)',
  })
  jamSelesai: string;

  @ApiProperty({ example: 'B1', description: 'Ruangan' })
  @IsString()
  ruangan: string;

  @ApiProperty({
    example: 'Ganjil',
    description: 'Semester',
    enum: ['Ganjil', 'Genap'],
  })
  @IsIn(['Ganjil', 'Genap'], {
    message: 'Semester harus Ganjil atau Genap',
  })
  semester: string;

  @ApiProperty({ example: '2024/2025', description: 'Tahun ajaran' })
  @IsString()
  @Matches(/^\d{4}\/\d{4}$/, {
    message: 'tahunAjaran harus dalam format YYYY/YYYY (contoh: 2024/2025)',
  })
  tahunAjaran: string;
}
