import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateKrsDto } from './{dto}/create-krs.dto';
import { UpdateDosenDto } from '../dosen/{dto}/update-dosen.dto';
import { UpdateKrsDto } from './{dto}/update-krs.dto';

@Injectable()
export class KrsService {
  constructor(private prisma: PrismaService) {}

  async create(createKrsDto: CreateKrsDto) {
    const mahasiswa = this.prisma.mahasiswa.findUnique({
      where: {
        id: createKrsDto.mahasiswaId,
      },
    });

    if (!mahasiswa) {
      throw new NotFoundException('Mahasiswa tidak ditemukan');
    }

    const mataKuliah = await this.prisma.mataKuliah.findUnique({
      where: {
        id: createKrsDto.mataKuliahId,
      },
    });

    if (!mataKuliah) {
      throw new NotFoundException('Mata Kuliah tidak ditemukan');
    }

    const existingKrs = await this.prisma.kartuRencanaStudi.findFirst({
      where: {
        mahasiswaId: createKrsDto.mahasiswaId,
        mataKuliahId: createKrsDto.mahasiswaId,
        tahunAjaran: createKrsDto.tahunAjaran,
        semester: createKrsDto.semester,
      },
    });

    if (existingKrs) {
      throw new ConflictException('Mahasiswa sudah mengambil mata kuliah ini pada periode yang sama');
    }

    const currentSks = await this.prisma.kartuRencanaStudi.findMany({
      where: {
        mahasiswaId: createKrsDto.mahasiswaId,
        tahunAjaran: createKrsDto.tahunAjaran,
        semester: createKrsDto.semester,
        status: { in: ['AKTIF', 'LULUS'] },
      },

      include: {
        mataKuliah: {
          select: { sks: true },
        },
      },
    });

    const totalSks = currentSks.reduce((sum, krs) => {
      return sum + (krs.mataKuliah?.sks || 0);
    }, 0);

    const newTotalSks = totalSks + mataKuliah.sks;

    if (newTotalSks > 24) {
      throw new BadRequestException(
        `Total SKS melebihi batas maksimal (${newTotalSks}/24 SKS)` +
          `Mahasiswa hanya bisa mengambil ${24 - totalSks} SKS lagi.`,
      );
    }

    const krs = await this.prisma.kartuRencanaStudi.create({
      data: createKrsDto,
      include: {
        mahasiswa: true,
        mataKuliah: true,
      },
    });

    return krs;
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    mahasiswaId?: string;
    tahunAjaran?: string;
    semester?: string;
    status?: string;
  }) {
    const { page = 1, limit = 10, mahasiswaId, tahunAjaran, semester, status } = params || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    if (mahasiswaId) {
      where.mahasiswaId = mahasiswaId;
    }

    if (tahunAjaran) {
      where.tahunAjaran = tahunAjaran;
    }

    if (semester) {
      where.semester = semester;
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.kartuRencanaStudi.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          mahasiswa: true,
          mataKuliah: true,
        },
      }),
      this.prisma.kartuRencanaStudi.count({ where }),
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
    const krs = await this.prisma.kartuRencanaStudi.findUnique({
      where: { id },
      include: {
        mahasiswa: true,
        mataKuliah: {
          include: {
            jadwal: { where: { tahunAjaran: '2024/2025' } },
          },
        },
      },
    });

    if (!krs) {
      throw new NotFoundException(`KRS dengan ID ${id} tidak ditemukan`);
    }

    return krs;
  }

  async getSummary(mahasiswaId: string, tahunAjaran: string, semester: string) {
    const krs = await this.prisma.kartuRencanaStudi.findMany({
      where: {
        mahasiswaId,
        tahunAjaran,
        semester,
      },
      include: {
        mataKuliah: true,
      },
    });

    const totalSks = krs.reduce((sum, item) => sum + item.mataKuliah.sks, 0);
    const totalMataKuliah = krs.length;

    return {
      mahasiswaId,
      tahunAjaran,
      semester,
      totalMataKuliah,
      totalSks,
      maksimalSks: 24,
      sisaSks: 24 - totalSks,
      details: krs,
    };
  }

  async update(id: string, updateKrsDto: UpdateKrsDto) {
    try {
      const krs = await this.prisma.kartuRencanaStudi.update({
        where: { id },
        data: updateKrsDto,
        include: {
          mahasiswa: true,
          mataKuliah: true,
        },
      });

      return krs;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`KRS dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.kartuRencanaStudi.delete({
        where: { id },
      });
      return { message: 'KRS berhasil dihapus' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`KRS dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
