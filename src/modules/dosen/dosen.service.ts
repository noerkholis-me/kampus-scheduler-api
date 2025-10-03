import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDosenDto } from './{dto}/create-dosen.dto';
import { UpdateDosenDto } from './{dto}/update-dosen.dto';

@Injectable()
export class DosenService {
  constructor(private prisma: PrismaService) {}

  async create(createDosenDto: CreateDosenDto) {
    try {
      return await this.prisma.dosen.create({
        data: createDosenDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('NIP atau email sudah terdaftar');
      }

      throw error;
    }
  }

  async findAll(params?: { page?: number; limit?: number; search?: string }) {
    const { page, limit, search } = params || {};
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nama: { contains: search, mode: 'insensitive' as const } },
            { nip: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.dosen.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { pengampu: true, jadwal: true },
          },
        },
      }),
      this.prisma.dosen.count({ where }),
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
    const dosen = await this.prisma.dosen.findUnique({
      where: { id },
      include: {
        pengampu: {
          include: {
            mataKuliah: true,
          },
        },
        jadwal: { include: { mataKuliah: true } },
      },
    });

    if (!dosen) {
      throw new NotFoundException(`Dosen dengan ID ${id} tidak ditemukan`);
    }

    return dosen;
  }

  async update(id: string, updateDosenDto: UpdateDosenDto) {
    try {
      const dosen = await this.prisma.dosen.update({
        where: { id },
        data: updateDosenDto,
      });

      return dosen;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Dosen dengan ID ${id} tidak ditemukan`);
      }

      if (error.code === 'P2002') {
        throw new ConflictException('NIP atau email sudah terdaftar');
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.dosen.delete({
        where: { id },
      });
      return { message: 'Dosen deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Dosen dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
