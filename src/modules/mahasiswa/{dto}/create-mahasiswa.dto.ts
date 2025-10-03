import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateMahasiswaDto {
  @ApiProperty({ example: 2021110001, description: 'NIM Mahasiswa' })
  @IsNumberString()
  @Length(10, 10, { message: 'NIM harus 10 karakter' })
  nim: string;

  @ApiProperty({
    example: 'Zazqia Priciela Amanda',
    description: 'Nama Mahasiswa',
  })
  @IsString()
  @Length(3, 100)
  nama: string;

  @ApiProperty({
    example: 'zazqiapriciela@gmail.com',
    description: 'Email Mahasiswa',
  })
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @ApiProperty({ example: 'Teknik Informatika', description: 'Jurusan' })
  @IsString()
  @Length(5, 30, { message: 'Jurusan maksimal 30 karakter' })
  jurusan: string;

  @ApiProperty({ example: '3', description: 'Semester saat ini (1-14)' })
  @IsInt()
  @Min(1, { message: 'Semester minimal 1' })
  @Max(14, { message: 'Semester minimal 14' })
  semester: number;
}
