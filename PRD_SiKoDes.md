# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# SiKoDes / SIMKOP-Link (Sistem Informasi Manajemen Koperasi Digital)

## Sistem Informasi Koperasi Digital Berbasis Web untuk Manajemen Produk Agroforestri, Simpan Pinjam, dan Transparansi Keuangan

---

# 1. INFORMASI UMUM

## Nama Sistem

SiKoDes / SIMKOP-Link (Sistem Informasi Manajemen Koperasi Digital)

## Jenis Sistem

Web-Based Information System, ERP Koperasi Mini & E-Catalog Terintegrasi

## Bidang

Koperasi Pertanian/Agroforestri, Pemberdayaan Ekonomi Desa, Keuangan Mikro

## Mitra Implementasi

Koperasi Agro Mulyo Lestari, Desa Girimulyo, Kecamatan Marga Sekampung, Kabupaten Lampung Timur

## Pengguna Utama

* Super Administrator (Ketua Koperasi / IT)
* Pengurus / Manajer Koperasi
* Petugas Administrasi / Kasir
* Anggota Koperasi
* Masyarakat Umum / Konsumen Produk (Guest)

---

# 2. LATAR BELAKANG

Koperasi Agro Mulyo Lestari selama ini beroperasi menggunakan sistem pencatatan buku besar fisik. Hal ini menimbulkan berbagai masalah operasional, di antaranya:
1. Rentan terhadap kehilangan atau kerusakan data pembukuan.
2. Proses rekapitulasi laporan bulanan dan tahunan (terutama untuk Rapat Anggota Tahunan/RAT) memakan waktu yang sangat lama.
3. Anggota kesulitan mengetahui jumlah pasti simpanan, sisa pinjaman, dan hak Sisa Hasil Usaha (SHU) mereka secara real-time karena harus datang langsung ke kantor koperasi.
4. Perhitungan bagi hasil atau SHU yang rumit dan berpotensi memunculkan *human error*.
5. Pemasaran produk agroforestri (hasil tani, bibit, olahan) anggota hanya terbatas di tingkat lokal desa dan mengandalkan sistem *word-of-mouth*.

Untuk memecahkan masalah tersebut, **SiKoDes (SIMKOP-Link)** dirancang sebagai platform digital komprehensif (ERP mini) yang akan mendigitalkan seluruh proses bisnis koperasi mulai dari *core banking* (simpan pinjam) hingga *e-commerce* lokal (e-catalog), sehingga tercipta transparansi, efisiensi waktu, dan perluasan jangkauan pasar.

---

# 3. TUJUAN SISTEM

## Tujuan Umum

Mewujudkan ekosistem koperasi digital yang modern, akuntabel, dan transparan, sekaligus mendorong peningkatan ekonomi sirkular desa berbasis agroforestri.

## Tujuan Khusus

1. **Digitalisasi Database**: Mendata seluruh anggota koperasi beserta rekam jejak finansialnya dalam satu *database* terpusat yang aman.
2. **Otomatisasi Finansial**: Mengotomatisasi perhitungan matematis untuk simpanan, angsuran pinjaman, denda, hingga pembagian SHU.
3. **Transparansi Anggota**: Memberikan portal khusus (Dashboard Anggota) agar setiap anggota dapat memonitor asetnya secara mandiri 24/7.
4. **Pemasaran Digital (E-Catalog)**: Menyediakan platform etalase digital bagi produk-produk tani anggota koperasi yang dapat diakses publik luas.
5. **Kemudahan Transaksi**: Mengintegrasikan sistem pesanan produk E-Catalog dengan WhatsApp API untuk respon cepat.
6. **Laporan Akurat**: Menghasilkan *Generate Report* (Laba-Rugi, Neraca, Arus Kas) dengan satu klik untuk kebutuhan RAT (Rapat Anggota Tahunan).

---

# 4. ARSITEKTUR SISTEM

## Frontend

* **Markup & Styling**: HTML5, CSS3, Tailwind CSS / Bootstrap 5
* **Interaktivitas**: JavaScript (ES6+), Alpine.js / React.js (untuk UI yang kompleks)
* **Aset**: Font Awesome 6, Google Fonts (Inter)

## Backend & Framework

* **Core Framework**: Laravel 10+ (PHP 8.2+) atau Node.js (Next.js/Express)
* **Arsitektur**: Model-View-Controller (MVC) & RESTful API

## Database & Penyimpanan

* **Relational Database**: MySQL 8.x atau PostgreSQL 14+
* **Caching**: Redis (untuk optimasi loading dashboard dan katalog)
* **File Storage**: AWS S3 atau Local Storage (untuk foto profil, bukti transfer, dan gambar produk)

## Layanan Pihak Ketiga (Integrasi)

* **WhatsApp API / Gateway**: Fonnte, Watzap, atau Meta Cloud API (untuk OTP dan Notifikasi)
* **Payment Gateway (Fase Lanjut)**: Midtrans atau Xendit (untuk Virtual Account bayar angsuran/simpanan)

## Hosting & Infrastruktur

* Cloud VPS (Linux Ubuntu 22.04 LTS), Nginx Web Server, SSL/TLS Certificate (Let's Encrypt).

---

# 5. MODUL SISTEM DETAIL

# MODUL 1
# MANAJEMEN KEANGGOTAAN (MEMBERSHIP)

## Tujuan
Mengelola *lifecycle* anggota koperasi dari pendaftaran hingga mutasi/keluar.

## Data Entitas Anggota
* NIK (Nomor Induk Kependudukan - *Unique*)
* No. Anggota (Auto-generated, misal: KAML-2026-001)
* Nama Lengkap, Tempat & Tanggal Lahir, Jenis Kelamin
* Alamat Lengkap, RT/RW, Desa, Kecamatan
* Nomor WhatsApp Aktif (untuk login dan notifikasi)
* Pekerjaan Utama
* Nama Ahli Waris & Hubungan
* Tanggal Bergabung
* Status Anggota (Aktif / Non-Aktif / Pasif / Keluar)
* Scan KTP & Pas Foto (Upload Lampiran)

## Fitur Utama
* **Form Pendaftaran Online**: Calon anggota dapat mengisi form via web, status *Pending Approval*.
* **Verifikasi Admin**: Pengurus melakukan validasi dan mengaktifkan keanggotaan (generate No. Anggota).
* **Cetak Kartu**: *Generate* Kartu Anggota Digital (PDF) ber-barcode/QR Code.
* **Mutasi Keanggotaan**: Penonaktifan anggota beserta *settlement* pencairan hak simpanan jika keluar.

## Output
* Master Data Anggota yang valid.
* Buku Induk Anggota Digital.

---

# MODUL 2
# MANAJEMEN SIMPANAN (FUNDING)

## Tujuan
Mengelola semua dana masuk yang berasal dari simpanan anggota secara presisi.

## Kategori Simpanan
1. **Simpanan Pokok**: Dibayar sekali saat awal pendaftaran.
2. **Simpanan Wajib**: Dibayar rutin setiap bulan.
3. **Simpanan Sukarela / Tabungan**: Setoran bebas, dapat ditarik kapan saja.
4. **Simpanan Berjangka (Deposito Mini)**: Jika ada program khusus dengan jangka waktu tertentu.

## Data Transaksi Simpanan
* ID Transaksi (Auto)
* Tanggal Transaksi
* ID Anggota
* Jenis Simpanan
* Nominal
* Metode Pembayaran (Tunai Kasir / Transfer Bank)
* Bukti Transfer (jika ada)

## Fitur Utama
* **Input Setoran Kolektif / Individu**: Kasir memasukkan setoran anggota.
* **Penarikan Simpanan**: Input penarikan untuk simpanan sukarela dengan validasi limit saldo.
* **Auto-Reminder**: Pengingat otomatis simpanan wajib yang belum dibayar bulan ini.
* **Cetak Bukti Transaksi**: Struk digital yang dikirim via WhatsApp.

## Output
* Buku Tabungan Digital per Anggota.
* Mutasi Simpanan.

---

# MODUL 3
# MANAJEMEN PINJAMAN / PEMBIAYAAN (LENDING)

## Tujuan
Mengatur siklus kredit/pinjaman dari pengajuan, analisa kelayakan, pencairan, hingga angsuran bulanan.

## Data Pengajuan & Akad
* No. Kontrak Pengajuan
* Plafon Pinjaman yang Diajukan
* Tujuan Penggunaan (Modal Tani, Beli Bibit, Kebutuhan Darurat, dll)
* Tenor (Jangka Waktu, misal: 3, 6, 12 bulan)
* Margin / Bunga / Jasa Pinjaman (% per bulan)
* Agunan/Jaminan (Jika Diperlukan)
* Status (Menunggu, Disurvei, Disetujui, Ditolak)

## Data Angsuran
* Jatuh Tempo Bulanan
* Angsuran Pokok + Angsuran Jasa
* Denda Keterlambatan (Jika ada skema denda)
* Sisa Saldo Pokok (Outstanding)

## Fitur Utama
* **Simulasi Pinjaman**: Kalkulator digital perhitungan angsuran flat/menurun.
* **Workflow Persetujuan**: Pengurus menyetujui pinjaman berdasarkan *track record* simpanan anggota.
* **Pencairan Dana**: Pencatatan uang keluar dari kas untuk pinjaman.
* **Pembayaran Angsuran**: Kasir menginput pembayaran cicilan per bulan.
* **Pelunasan Dipercepat**: Perhitungan sisa pokok jika anggota melunasi lebih awal.
* **Tracking NPL (*Non-Performing Loan*)**: Penanda otomatis pinjaman macet/menunggak.

## Output
* Jadwal Amortisasi (Jadwal Angsuran).
* Kartu Piutang Anggota.
* Alert Angsuran Jatuh Tempo.

---

# MODUL 4
# PEMASARAN DIGITAL & E-CATALOG PRODUK TANI

## Tujuan
Mempromosikan dan menjual hasil bumi, bibit, dan olahan tani koperasi ke pasar yang lebih luas.

## Data Produk
* Kode SKU
* Kategori (Hasil Tani, Bibit, Sarana Produksi, Olahan, Edukasi Agro)
* Nama Produk
* Foto Utama & Galeri (maks. 4 foto)
* Deskripsi Lengkap
* Satuan (Kg, Liter, Pcs, Bibit)
* Harga Jual (Harga Umum & Harga Anggota)
* Stok Real-Time (Minimum threshold alert)

## Fitur Utama
* **Katalog Publik**: Tampilan grid elegan ala *E-Commerce* yang bisa diakses tanpa login.
* **Filter & Pencarian**: Berdasarkan kategori, harga, atau nama produk.
* **Manajemen Inventory**: *Stock In* (penerimaan panen anggota) dan *Stock Out* (terjual/rusak).
* **Checkout via WhatsApp**: Pembeli mengklik "Beli", otomatis membuka WA dengan template pesan detail order (Nama produk, Jumlah, Harga).
* **Riwayat Penjualan**: Pencatatan produk terjual untuk perhitungan laba.

## Output
* Etalase Produk Online (Front-end Web).
* Laporan Penjualan Produk Agroforestri.

---

# MODUL 5
# PERHITUNGAN SHU (SISA HASIL USAHA)

## Tujuan
Mendistribusikan keuntungan koperasi kepada anggota secara adil berdasarkan porsi modal dan porsi transaksi.

## Rumus Distribusi (Customizable via Setting)
* SHU Bagian Anggota (misal 40%)
* Dana Cadangan Koperasi (misal 30%)
* Dana Pengurus (misal 10%)
* Dana Sosial / Desa (misal 10%)
* Dana Pendidikan (misal 10%)

## Proporsi untuk Anggota
* **Jasa Modal**: Dihitung dari persentase total simpanan anggota dibagi total simpanan seluruh koperasi.
* **Jasa Usaha**: Dihitung dari persentase total pinjaman/transaksi anggota dibagi total transaksi seluruh koperasi.

## Fitur Utama
* **Auto-Calculate SHU Tahun Berjalan**: Sistem menghitung simulasi SHU otomatis tanpa perlu Excel manual.
* **Distribusi SHU**: Memindahkan nilai SHU hak anggota otomatis ke "Simpanan Sukarela" mereka saat RAT disahkan.

## Output
* Laporan Rincian SHU per Anggota.

---

# MODUL 6
# KEUANGAN & AKUNTANSI (CORE ACCOUNTING)

## Tujuan
Memastikan neraca koperasi selalu *balance* dan pencatatan kas keluar-masuk sesuai standar akuntansi dasar.

## Fitur Utama
* **Chart of Accounts (COA)**: Kode akun fleksibel (Kas, Piutang Anggota, Persediaan, Ekuitas, Pendapatan Jasa, Beban Operasional).
* **Jurnal Umum Otomatis**: Setiap transaksi simpanan/pinjaman otomatis terjurnal.
* **Jurnal Manual**: Untuk biaya operasional harian (bayar listrik, rapat, alat tulis, dll).
* **Tutup Buku Bulanan/Tahunan**: Mengunci transaksi periode lalu.

## Output
* Laporan Buku Besar (*General Ledger*).
* Laporan Laba/Rugi (*Profit & Loss*).
* Neraca Keuangan (*Balance Sheet*).
* Laporan Arus Kas (*Cash Flow*).

---

# 7. DASHBOARD BERBASIS ROLE

## A. Dashboard Pengurus / Admin Koperasi
* **Widget Metrik**: Total Kas, Total Piutang (Uang Beredar), Total Anggota, Laba Berjalan, Anggota Menunggak.
* **Grafik Visual**: Bar chart pertumbuhan aset, line chart kas masuk/keluar, pie chart status pinjaman (Lancar, Kurang Lancar, Diragukan, Macet).
* **Quick Actions**: Tombol cepat untuk tambah simpanan, bayar angsuran, atau input produk E-Catalog.

## B. Dashboard Anggota (Member Area)
* **Ringkasan Akun**: Tampilan kartu dompet digital berisi saldo Simpanan Pokok, Wajib, Sukarela.
* **Info Pinjaman**: Status pinjaman aktif, sisa pokok, sisa tenor, tanggal jatuh tempo terdekat.
* **Riwayat Transaksi**: *Timeline* log seluruh aktivitas uang masuk/keluar.
* **Info E-Catalog Eksklusif**: Harga khusus anggota.

---

# 8. KEBUTUHAN NON FUNGSIONAL

## Keamanan Data (Security)
* **Data Encryption**: Password di-*hash* dengan algoritma Bcrypt/Argon2.
* **Role-Based Access Control (RBAC)**: Anggota tidak bisa membuka menu Admin. Kasir tidak bisa mengubah pengaturan COA.
* **Audit Trail / System Log**: Mencatat *Siapa* melakukan *Apa* pada jam *Berapa* (contoh: "Admin A mengubah setoran Anggota B dari Rp50rb menjadi Rp500rb").
* **Auto-Backup**: Backup *database* mingguan otomatis ke cloud storage/Google Drive untuk mencegah *data loss*.

## Kinerja & UX (User Experience)
* Sistem dapat menangani minimal 1.000 anggota aktif tanpa lag.
* UI/UX dibuat seringan mungkin, karena akses seringkali menggunakan smartphone dengan sinyal internet desa yang mungkin tidak stabil.
* Implementasi PWA (*Progressive Web App*) agar web bisa "diinstal" sebagai aplikasi di *homescreen* HP Android anggota.

---

# 9. ROADMAP PENGEMBANGAN

## Fase 1: MVP & Front-End (Bulan 1-2)
* Pembuatan Landing Page Public & Desain UI E-Catalog.
* Desain Mockup Dashboard Admin & Anggota.
* Uji coba UI/UX dengan Dummy Data (menggunakan `app-data.js`).

## Fase 2: Core Banking System (Bulan 3-4)
* Pengembangan Backend, struktur Database MySQL.
* Modul Manajemen Anggota, Modul Simpanan, Modul Pinjaman.
* Pengaturan Autentikasi dan Role User.

## Fase 3: E-Catalog, Akuntansi & Laporan (Bulan 5-6)
* Integrasi modul E-Catalog yang tersambung ke inventory dan WA.
* Implementasi logika Jurnal Otomatis, Laba Rugi, dan Neraca.
* Perhitungan otomatis modul SHU.

## Fase 4: Ekspansi & Integrasi (Bulan 7+)
* Integrasi WhatsApp Gateway (Notifikasi transfer berhasil, peringatan tunggakan).
* Integrasi Payment Gateway (Virtual Account BRI, Mandiri, QRIS) agar anggota bisa bayar pinjaman lewat m-banking tanpa harus setor tunai ke admin.
* Peluncuran *Mobile App* Native (Opsional).

---

# 10. INDIKATOR KEBERHASILAN (KPI)

1. **Digitalisasi Penuh**: 100% data buku besar fisik berhasil bermigrasi ke sistem cloud dalam waktu 2 bulan setelah *go-live*.
2. **Efisiensi Rapat Tahunan (RAT)**: Laporan RAT dapat dicetak hanya dengan 1 klik (penghematan waktu kompilasi data dari berhari-hari menjadi 5 menit).
3. **Peningkatan Kepatuhan (Compliance)**: Penurunan *Non-Performing Loan* (kredit macet) minimal 30% karena adanya *WhatsApp reminder* otomatis.
4. **Pertumbuhan Penjualan Produk**: Peningkatan omzet penjualan hasil tani agroforestri minimal 40% dalam kuartal pertama implementasi E-Catalog.
5. **Transparansi & Kepercayaan**: 90% anggota aktif login ke dashboard mereka secara rutin untuk mengecek saldo.
6. **Zero Error Accounting**: Tidak ada lagi selisih antara pencatatan buku dengan uang fisik di kas besar maupun rekening bank koperasi.

---
*Dokumen ini merupakan panduan spesifikasi dan kerangka kerja (blueprint) pengembangan jangka panjang Sistem Informasi Koperasi Desa (SIMKOP-Link). Mengubah spesifikasi yang ada dalam PRD ini harus melalui persetujuan antara pengurus koperasi dan tim developer.*
