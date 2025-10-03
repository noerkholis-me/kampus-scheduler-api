import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMataKuliahDto } from './{dto}/create-mata-kuliah.dto';
import { UpdateMataKuliahDto } from './{dto}/update-mata-kuliah.dto';

@Injectable()
export class MataKuliahService {
  constructor(private prisma: PrismaService) {}

  async create(createMataKuliahDto: CreateMataKuliahDto) {
    try {
      const mataKuliah = await this.prisma.mataKuliah.create({
        data: createMataKuliahDto,
      });
      return mataKuliah;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Kode mata kuliah sudah terdaftar');
      }
      throw error;
    }
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    semester?: number;
  }) {
    const { page = 1, limit = 10, search = '', semester } = params || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { kode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (semester) {
      where.semester = semester;
    }

    const [data, total] = await Promise.all([
      this.prisma.mataKuliah.findMany({
        where,
        skip,
        take: limit,
        orderBy: { semester: 'asc' },
        include: {
          _count: {
            select: {
              pengampu: true,
              jadwal: true,
              krs: true,
            },
          },
        },
      }),
      this.prisma.mataKuliah.count({ where }),
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
    const mataKuliah = await this.prisma.mataKuliah.findUnique({
      where: { id },
      include: {
        pengampu: {
          include: {
            dosen: true,
          },
        },
        jadwal: {
          include: {
            dosen: true,
          },
        },
        krs: {
          include: {
            mahasiswa: true,
          },
        },
      },
    });

    if (!mataKuliah) {
      throw new NotFoundException(
        `Mata kuliah dengan ID ${id} tidak ditemukan`,
      );
    }

    return mataKuliah;
  }

  async update(id: string, updateMataKuliahDto: UpdateMataKuliahDto) {
    try {
      const mataKuliah = await this.prisma.mataKuliah.update({
        where: { id },
        data: updateMataKuliahDto,
      });
      return mataKuliah;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Mata kuliah dengan ID ${id} tidak ditemukan`,
        );
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Kode mata kuliah sudah terdaftar');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.mataKuliah.delete({
        where: { id },
      });
      return { message: 'Mata kuliah berhasil dihapus' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Mata kuliah dengan ID ${id} tidak ditemukan`,
        );
      }
      throw error;
    }
  }
}
