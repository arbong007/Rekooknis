import { redirect } from 'next/navigation'
import { getSession, logout } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  // Fetch data
  const kasList = await prisma.transaksi.findMany()
  const totalMasuk = kasList.filter(t => t.tipe === 'MASUK').reduce((a, b) => a + b.nominal, 0)
  const totalKeluar = kasList.filter(t => t.tipe === 'KELUAR').reduce((a, b) => a + b.nominal, 0)
  const saldoKas = totalMasuk - totalKeluar

  const anggotaCount = await prisma.user.count({ where: { role: 'ANGGOTA' } })

  const pinjamanAktifList = await prisma.pinjaman.findMany({ 
    where: { status: 'AKTIF' },
    include: { user: true }
  })
  const totalPinjamanBeredar = pinjamanAktifList.reduce((a, b) => a + b.sisaSaldo, 0)

  // Dummy catalog sales since we don't have catalog transaction in schema yet
  const totalPenjualan = 12500000

  const trxTerbaru = await prisma.transaksi.findMany({
    take: 5,
    orderBy: { tanggal: 'desc' }
  })
  
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f4', color: '#1a1a2e', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #eee', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f0f0f0' }}>
          <img src="/koperasi logo.png" alt="Logo" style={{ width: '40px', borderRadius: '8px' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2E7D32' }}>Admin SIMKOP</h2>
        </div>
        <nav style={{ padding: '20px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', padding: '15px 24px 5px', fontWeight: 700 }}>Main Menu</div>
          <a href="/admin" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '14px', color: '#2E7D32', background: '#E8F5E9', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', borderLeft: '4px solid #43A047' }}>
            Dashboard
          </a>
          
          <div style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', padding: '15px 24px 5px', fontWeight: 700 }}>Data Master</div>
          <a href="#" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '14px', color: '#555', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', borderLeft: '4px solid transparent' }}>Anggota</a>
          <a href="#" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '14px', color: '#555', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', borderLeft: '4px solid transparent' }}>E-Catalog / Stok</a>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
          <form action={logout}>
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#FFEBEE', color: '#C62828', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Keluar</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '30px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Overview Koperasi</h1>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Ringkasan operasional dan keuangan Koperasi Agro Mulyo Lestari</p>
          </div>
          <div>
            <span style={{ background: '#2E7D32', color: 'white', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '20px', fontWeight: 600 }}>
              Tahun Buku: {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#E8F5E9', color: '#388E3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>💰</div>
            <div>
              <div style={{ color: '#555', fontSize: '0.8rem', fontWeight: 600 }}>Saldo Kas Utama</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formatRupiah(saldoKas)}</div>
            </div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#E3F2FD', color: '#1976D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>👥</div>
            <div>
              <div style={{ color: '#555', fontSize: '0.8rem', fontWeight: 600 }}>Total Anggota</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{anggotaCount}</div>
            </div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#FFF8E1', color: '#F57F17', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>📝</div>
            <div>
              <div style={{ color: '#555', fontSize: '0.8rem', fontWeight: 600 }}>Pinjaman Beredar</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formatRupiah(totalPinjamanBeredar)}</div>
            </div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#F3E5F5', color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🛒</div>
            <div>
              <div style={{ color: '#555', fontSize: '0.8rem', fontWeight: 600 }}>Penjualan E-Catalog</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formatRupiah(totalPenjualan)}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Recent Trx */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '24px', gridColumn: '1 / span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Transaksi Terbaru</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>Tanggal</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>Tipe</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>Kategori</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {trxTerbaru.map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>{t.tanggal.toLocaleDateString('id-ID')}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: t.tipe === 'MASUK' ? '#E8F5E9' : '#FFEBEE', color: t.tipe === 'MASUK' ? '#2E7D32' : '#C62828' }}>
                        {t.tipe}
                      </span>
                    </td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>{t.kategori}</td>
                    <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem', fontWeight: 600 }}>{formatRupiah(t.nominal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daftar Pinjaman Aktif</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>No. Kontrak</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>Anggota</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>Plafon Pinjaman</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>Tenor</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.85rem' }}>Sisa Saldo</th>
              </tr>
            </thead>
            <tbody>
              {pinjamanAktifList.map((p, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>{p.nomor}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem', fontWeight: 600 }}>{p.user.nama}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>{formatRupiah(p.nominal)}</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>{p.tenorBulan} Bln</td>
                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontSize: '0.9rem', fontWeight: 600, color: '#2E7D32' }}>{formatRupiah(p.sisaSaldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}
