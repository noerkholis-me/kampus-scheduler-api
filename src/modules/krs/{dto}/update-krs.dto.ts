import { CreateDosenDto } from '@/modules/dosen/{dto}/create-dosen.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateKrsDto } from './create-krs.dto';

export class UpdateKrsDto extends PartialType(OmitType(CreateKrsDto, ['mahasiswaId', 'mataKuliahId'])) {}
