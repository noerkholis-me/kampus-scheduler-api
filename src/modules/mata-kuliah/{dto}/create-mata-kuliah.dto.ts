import { IsString, IsInt, Min, Max, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMataKuliahDto {
  @ApiProperty({ example: 'IF305', description: 'Kode mata kuliah' })
  @IsString()
  @Length(5, 10, { message: 'Kode mata kuliah harus 5-10 karakter' })
  kode: string;

  @ApiProperty({ example: 'Basis Data', description: 'Nama mata kuliah' })
  @IsString()
  @Length(3, 100)
  nama: string;

  @ApiProperty({ example: 3, description: 'Jumlah SKS (1-6)' })
  @IsInt()
  @Min(1, { message: 'SKS minimal 1' })
  @Max(6, { message: 'SKS maksimal 6' })
  sks: number;

  @ApiProperty({ example: 5, description: 'Semester (1-8)' })
  @IsInt()
  @Min(1, { message: 'Semester minimal 1' })
  @Max(8, { message: 'Semester maksimal 8' })
  semester: number;

  @ApiProperty({
    example: 'Konsep dan implementasi database',
    description: 'Deskripsi mata kuliah',
    required: false,
  })
  @IsOptional()
  @IsString()
  deskripsi?: string;
}
