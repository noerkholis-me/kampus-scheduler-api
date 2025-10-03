import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.kartuRencanaStudi.deleteMany();
  await prisma.jadwal.deleteMany();
  await prisma.dosenMataKuliah.deleteMany();
  await prisma.mahasiswa.deleteMany();
  await prisma.mataKuliah.deleteMany();
  await prisma.dosen.deleteMany();

  console.log('🗑️  Cleared existing data');

  const dosen1 = await prisma.dosen.create({
    data: {
      nip: '198501012010121001',
      nama: 'Dr. Budi Santoso, M.Kom',
      email: 'budi.santoso@university.ac.id',
      telepon: '081234567890',
    },
  });

  const dosen2 = await prisma.dosen.create({
    data: {
      nip: '198703152012121002',
      nama: 'Dr. Siti Nurhaliza, M.T',
      email: 'siti.nurhaliza@university.ac.id',
      telepon: '081234567891',
    },
  });

  const dosen3 = await prisma.dosen.create({
    data: {
      nip: '199001202015121003',
      nama: 'Prof. Ahmad Dahlan, Ph.D',
      email: 'ahmad.dahlan@university.ac.id',
      telepon: '081234567892',
    },
  });

  console.log('✅ Seeded 3 dosen');

  const mahasiswa1 = await prisma.mahasiswa.create({
    data: {
      nim: '2021110001',
      nama: 'Andi Pratama',
      email: 'andi.pratama@student.ac.id',
      jurusan: 'Teknik Informatika',
      semester: 5,
    },
  });

  const mahasiswa2 = await prisma.mahasiswa.create({
    data: {
      nim: '2021110002',
      nama: 'Dewi Lestari',
      email: 'dewi.lestari@student.ac.id',
      jurusan: 'Teknik Informatika',
      semester: 5,
    },
  });

  const mahasiswa3 = await prisma.mahasiswa.create({
    data: {
      nim: '2022110003',
      nama: 'Rudi Hermawan',
      email: 'rudi.hermawan@student.ac.id',
      jurusan: 'Sistem Informasi',
      semester: 3,
    },
  });

  const mahasiswa4 = await prisma.mahasiswa.create({
    data: {
      nim: '2022110004',
      nama: 'Sari Wulandari',
      email: 'sari.wulandari@student.ac.id',
      jurusan: 'Sistem Informasi',
      semester: 3,
    },
  });

  console.log('✅ Seeded 4 mahasiswa');

  const mk1 = await prisma.mataKuliah.create({
    data: {
      kode: 'IF101',
      nama: 'Algoritma dan Pemrograman',
      sks: 3,
      semester: 1,
      deskripsi: 'Mata kuliah dasar pemrograman',
    },
  });

  const mk2 = await prisma.mataKuliah.create({
    data: {
      kode: 'IF201',
      nama: 'Struktur Data',
      sks: 3,
      semester: 3,
      deskripsi: 'Mempelajari berbagai struktur data',
    },
  });

  const mk3 = await prisma.mataKuliah.create({
    data: {
      kode: 'IF301',
      nama: 'Basis Data',
      sks: 3,
      semester: 5,
      deskripsi: 'Konsep dan implementasi database',
    },
  });

  const mk4 = await prisma.mataKuliah.create({
    data: {
      kode: 'IF302',
      nama: 'Pemrograman Web',
      sks: 4,
      semester: 5,
      deskripsi: 'Pengembangan aplikasi berbasis web',
    },
  });

  const mk5 = await prisma.mataKuliah.create({
    data: {
      kode: 'SI201',
      nama: 'Analisis dan Perancangan Sistem',
      sks: 3,
      semester: 3,
      deskripsi: 'Metodologi pengembangan sistem informasi',
    },
  });

  console.log('✅ Seeded 5 mata kuliah');

  await prisma.dosenMataKuliah.createMany({
    data: [
      {
        dosenId: dosen1.id,
        mataKuliahId: mk1.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
      },
      {
        dosenId: dosen1.id,
        mataKuliahId: mk2.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
      },
      {
        dosenId: dosen2.id,
        mataKuliahId: mk3.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
      },
      {
        dosenId: dosen2.id,
        mataKuliahId: mk4.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
      },
      {
        dosenId: dosen3.id,
        mataKuliahId: mk5.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
      },
    ],
  });

  console.log('✅ Seeded dosen mata kuliah relations');

  await prisma.jadwal.createMany({
    data: [
      {
        mataKuliahId: mk1.id,
        dosenId: dosen1.id,
        hari: 'Senin',
        jamMulai: '08:00',
        jamSelesai: '10:30',
        ruangan: 'A101',
        semester: 'Ganjil',
        tahunAjaran: '2024/2025',
      },
      {
        mataKuliahId: mk2.id,
        dosenId: dosen1.id,
        hari: 'Selasa',
        jamMulai: '10:30',
        jamSelesai: '13:00',
        ruangan: 'A102',
        semester: 'Ganjil',
        tahunAjaran: '2024/2025',
      },
      {
        mataKuliahId: mk3.id,
        dosenId: dosen2.id,
        hari: 'Rabu',
        jamMulai: '08:00',
        jamSelesai: '10:30',
        ruangan: 'B201',
        semester: 'Ganjil',
        tahunAjaran: '2024/2025',
      },
      {
        mataKuliahId: mk4.id,
        dosenId: dosen2.id,
        hari: 'Kamis',
        jamMulai: '13:00',
        jamSelesai: '16:20',
        ruangan: 'LAB301',
        semester: 'Ganjil',
        tahunAjaran: '2024/2025',
      },
      {
        mataKuliahId: mk5.id,
        dosenId: dosen3.id,
        hari: 'Jumat',
        jamMulai: '08:00',
        jamSelesai: '10:30',
        ruangan: 'C101',
        semester: 'Ganjil',
        tahunAjaran: '2024/2025',
      },
    ],
  });

  console.log('✅ Seeded 5 jadwal');

  await prisma.kartuRencanaStudi.createMany({
    data: [
      {
        mahasiswaId: mahasiswa1.id,
        mataKuliahId: mk3.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
        status: 'AKTIF',
      },
      {
        mahasiswaId: mahasiswa1.id,
        mataKuliahId: mk4.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
        status: 'AKTIF',
      },
      {
        mahasiswaId: mahasiswa2.id,
        mataKuliahId: mk3.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
        status: 'AKTIF',
      },
      {
        mahasiswaId: mahasiswa2.id,
        mataKuliahId: mk4.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
        status: 'AKTIF',
      },
      {
        mahasiswaId: mahasiswa3.id,
        mataKuliahId: mk2.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
        status: 'AKTIF',
      },
      {
        mahasiswaId: mahasiswa3.id,
        mataKuliahId: mk5.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
        status: 'AKTIF',
      },
      {
        mahasiswaId: mahasiswa4.id,
        mataKuliahId: mk2.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
        status: 'AKTIF',
      },
      {
        mahasiswaId: mahasiswa4.id,
        mataKuliahId: mk5.id,
        tahunAjaran: '2024/2025',
        semester: 'Ganjil',
        status: 'AKTIF',
      },
    ],
  });

  console.log('✅ Seeded KRS data');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
