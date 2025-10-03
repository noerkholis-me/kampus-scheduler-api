import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateDosenDto {
  @ApiProperty({ example: '198501012010121001', description: 'NIP Dosen' })
  @IsString()
  @Length(18, 18, { message: 'NIP harus 18 karakter' })
  nip: string;

  @ApiProperty({
    example: 'Dr. Nurkholis Majid, M.kom',
    description: 'Nama Dosen',
  })
  @IsString()
  @Length(3, 100)
  nama: string;

  @ApiProperty({
    example: 'nurkholismajid@gmail.com',
    description: 'Email Dosen',
  })
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @ApiProperty({
    example: '081234567890',
    description: 'Nomor telepon',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(\+62|62|0)[0-9]{9,12}$/, {
    message: 'Format telepon tidak valid',
  })
  telepon: string;
}
