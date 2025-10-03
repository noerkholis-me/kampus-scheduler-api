import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMahasiswaDto } from './{dto}/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './{dto}/update-mahasiswa.dto';

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) {}

  async create(createMahasiswaDto: CreateMahasiswaDto) {
    try {
      return await this.prisma.mahasiswa.create({
        data: createMahasiswaDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('NIM atau email sudah terdaftar');
      }
      throw error;
    }
  }

  async findAll(params?: { page?: number; limit?: number; search?: string }) {
    const { page, limit, search } = params || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.mahasiswa.findMany({
        where: {
          OR: [
            {
              nama: { contains: search, mode: 'insensitive' },
            },
            {
              nim: { contains: search, mode: 'insensitive' },
            },
            {
              email: { contains: search, mode: 'insensitive' },
            },
          ],
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          krs: true,
        },
      }),
      this.prisma.mahasiswa.count({
        where: {
          OR: [
            {
              nama: { contains: search, mode: 'insensitive' },
            },
            {
              nim: { contains: search, mode: 'insensitive' },
            },
            {
              email: { contains: search, mode: 'insensitive' },
            },
          ],
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id },
      include: {
        krs: true,
      },
    });

    if (!mahasiswa) {
      throw new NotFoundException(`Mahasiswa dengan ID ${id} tidak ditemukan `);
    }

    return mahasiswa;
  }

  async update(id: string, updateMahasiswaDto: UpdateMahasiswaDto) {
    try {
      const mahasiswa = await this.prisma.mahasiswa.update({
        where: { id },
        data: updateMahasiswaDto,
      });

      return mahasiswa;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Mahasiswa dengan ID ${id} tidak ditemukan`,
        );
      }

      if (error.code === 'P2002') {
        throw new ConflictException('NIM atau email sudah terdaftar');
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.mahasiswa.delete({
        where: { id },
      });
      return { message: 'Mahasiswa deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Mahasiswa dengan ID ${id} tidak ditemukan`,
        );
      }
      throw error;
    }
  }
}
