import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DosenModule } from './modules/dosen/dosen.module';
import { MahasiswaModule } from './modules/mahasiswa/mahasiswa.module';
import { MataKuliahModule } from './modules/mata-kuliah/mata-kuliah.module';
import { JadwalModule } from './modules/jadwal/jadwal.module';
import { KrsModule } from './modules/krs/krs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DosenModule,
    MahasiswaModule,
    MataKuliahModule,
    JadwalModule,
    KrsModule,
  ],
})
export class AppModule {}
