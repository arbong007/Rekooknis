import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.angsuran.deleteMany()
  await prisma.pinjaman.deleteMany()
  await prisma.simpanan.deleteMany()
  await prisma.transaksi.deleteMany()
  await prisma.produk.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      nik: '1111111111111111',
      nama: 'Administrator',
      password: 'admin', // plain text for prototype testing
      role: 'ADMIN',
    },
  })

  const anggota = await prisma.user.create({
    data: {
      nik: '3514101234560001',
      nama: 'Sukarman',
      password: 'koperasi123',
      role: 'ANGGOTA',
    },
  })

  const anggota2 = await prisma.user.create({
    data: {
      nik: '3514101234560002',
      nama: 'Budi Santoso',
      password: 'koperasi123',
      role: 'ANGGOTA',
    },
  })

  // 2. Create Simpanan for Sukarman
  await prisma.simpanan.createMany({
    data: [
      { userId: anggota.id, jenis: 'POKOK', nominal: 100000, keterangan: 'Simpanan Pokok Awal' },
      { userId: anggota.id, jenis: 'WAJIB', nominal: 50000, keterangan: 'Wajib Bulan Jan' },
      { userId: anggota.id, jenis: 'WAJIB', nominal: 50000, keterangan: 'Wajib Bulan Feb' },
      { userId: anggota.id, jenis: 'SUKARELA', nominal: 250000, keterangan: 'Sukarela' },
    ]
  })

  // 3. Create Pinjaman for Sukarman
  const pinjaman = await prisma.pinjaman.create({
    data: {
      userId: anggota.id,
      nomor: 'PINJ-2025-001',
      nominal: 5000000,
      tenorBulan: 12,
      bungaPersen: 1.5,
      sisaSaldo: 4000000,
      status: 'AKTIF',
      angsuran: {
        create: [
          { angsuranKe: 1, jatuhTempo: new Date('2025-02-10'), nominal: 491666, status: 'LUNAS', tglBayar: new Date('2025-02-05') },
          { angsuranKe: 2, jatuhTempo: new Date('2025-03-10'), nominal: 491666, status: 'LUNAS', tglBayar: new Date('2025-03-08') },
          { angsuranKe: 3, jatuhTempo: new Date('2025-04-10'), nominal: 491666, status: 'BELUM_LUNAS' },
        ]
      }
    }
  })

  // 4. Create Produk E-Catalog
  await prisma.produk.createMany({
    data: [
      { kode: 'PUPUK-UREA-01', nama: 'Pupuk Urea 50kg', kategori: 'Pertanian', harga: 125000, stok: 40 },
      { kode: 'BIBIT-JGN-01', nama: 'Bibit Jagung Manis', kategori: 'Pertanian', harga: 85000, stok: 15 },
      { kode: 'PEST-01', nama: 'Pestisida Pembasmi Hama', kategori: 'Pertanian', harga: 65000, stok: 20 },
      { kode: 'PANEN-PADI-01', nama: 'Beras Premium 5kg', kategori: 'Hasil Tani', harga: 72000, stok: 100 },
    ]
  })

  // 5. Create Transaksi Kas
  await prisma.transaksi.createMany({
    data: [
      { userId: admin.id, tipe: 'MASUK', kategori: 'Simpanan', nominal: 100000, keterangan: 'Setoran Pokok Sukarman' },
      { userId: admin.id, tipe: 'KELUAR', kategori: 'Pinjaman', nominal: 5000000, keterangan: 'Pencairan Pinjaman Sukarman' },
      { userId: admin.id, tipe: 'MASUK', kategori: 'Angsuran', nominal: 491666, keterangan: 'Angsuran 1 Sukarman' },
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
