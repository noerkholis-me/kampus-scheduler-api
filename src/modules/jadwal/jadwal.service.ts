import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJadwalDto } from './{dto}/create-jadwal.dto';
import { UpdateJadwalDto } from './{dto}/update-jadwal.dto';

@Injectable()
export class JadwalService {
  constructor(private prisma: PrismaService) {}

  private validateTimeRange(jamMulai: string, jamSelesai: string) {
    const [startHour, startMinute] = jamMulai.split(':').map(Number);
    const [endHour, endMinute] = jamSelesai.split(':').map(Number);

    const startTIme = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (endTime <= startTIme) {
      throw new BadRequestException(
        'Jam selesai harus lebih besar dari jam mulai',
      );
    }
  }

  async create(createJadwalDto: CreateJadwalDto) {
    this.validateTimeRange(
      createJadwalDto.jamMulai,
      createJadwalDto.jamSelesai,
    );

    const mataKuliah = await this.prisma.mataKuliah.findUnique({
      where: {
        id: createJadwalDto.mataKuliahId,
      },
    });

    if (!mataKuliah) {
      throw new NotFoundException('Mata kuliah tidak ditemukan');
    }

    const dosen = await this.prisma.dosen.findUnique({
      where: {
        id: createJadwalDto.dosenId,
      },
    });

    if (!dosen) {
      throw new NotFoundException('Dosen tidak ditemukan');
    }

    const conflictSchedule = await this.prisma.jadwal.findFirst({
      where: {
        OR: [
          {
            ruangan: createJadwalDto.ruangan,
            hari: createJadwalDto.hari,
            tahunAjaran: createJadwalDto.tahunAjaran,
            semester: createJadwalDto.semester,
          },
          {
            dosenId: createJadwalDto.dosenId,
            hari: createJadwalDto.hari,
            tahunAjaran: createJadwalDto.tahunAjaran,
            semester: createJadwalDto.semester,
          },
        ],
      },
    });

    if (conflictSchedule) {
      throw new ConflictException(
        'Jadwal bentrok dengan jadwal yang sudah ada (ruangan atau dosen tidak tersedia)',
      );
    }

    const jadwal = this.prisma.jadwal.create({
      data: createJadwalDto,
      include: { dosen: true, mataKuliah: true },
    });

    return jadwal;
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    hari?: string;
    tahunAjaran?: string;
    semester?: string;
  }) {
    const { page = 1, limit = 10, hari, tahunAjaran, semester } = params || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    if (hari) {
      where.hari = hari;
    }

    if (tahunAjaran) {
      where.tahunAjaran = tahunAjaran;
    }

    if (semester) {
      where.semester = semester;
    }

    const [data, total] = await Promise.all([
      this.prisma.jadwal.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ hari: 'asc' }, { jamMulai: 'asc' }],
        include: {
          mataKuliah: true,
          dosen: true,
        },
      }),
      this.prisma.jadwal.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const jadwal = await this.prisma.jadwal.findUnique({
      where: { id },
      include: {
        mataKuliah: {
          include: {
            krs: {
              include: {
                mahasiswa: true,
              },
            },
          },
        },
        dosen: true,
      },
    });

    if (!jadwal) {
      throw new NotFoundException(`Jadwal dengan ID ${id} tidak ditemukan`);
    }

    return jadwal;
  }

  async update(id: string, updateJadwalDto: UpdateJadwalDto) {
    if (updateJadwalDto.jamMulai && updateJadwalDto.jamSelesai) {
      this.validateTimeRange(
        updateJadwalDto.jamMulai,
        updateJadwalDto.jamSelesai,
      );
    }

    try {
      const jadwal = await this.prisma.jadwal.update({
        where: { id },
        data: updateJadwalDto,
        include: {
          mataKuliah: true,
          dosen: true,
        },
      });
      return jadwal;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Jadwal dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.jadwal.delete({
        where: { id },
      });
      return { message: 'Jadwal berhasil dihapus' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Jadwal dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
