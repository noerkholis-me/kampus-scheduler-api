import { Module } from '@nestjs/common';
import { KrsService } from './krs.service';
import { KrsController } from './krs.controller';

@Module({
  providers: [KrsService],
  controllers: [KrsController]
})
export class KrsModule {}
