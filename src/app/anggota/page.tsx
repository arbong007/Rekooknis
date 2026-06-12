import { redirect } from 'next/navigation'
import { getSession, logout } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function AnggotaDashboard() {
  const session = await getSession()
  if (!session || session.role !== 'ANGGOTA') {
    redirect('/login')
  }

  // Fetch data
  const simpanan = await prisma.simpanan.findMany({ where: { userId: session.userId } })
  const pokok = simpanan.filter(s => s.jenis === 'POKOK').reduce((a, b) => a + b.nominal, 0)
  const wajib = simpanan.filter(s => s.jenis === 'WAJIB').reduce((a, b) => a + b.nominal, 0)
  const sukarela = simpanan.filter(s => s.jenis === 'SUKARELA').reduce((a, b) => a + b.nominal, 0)
  const totalSimpanan = pokok + wajib + sukarela

  const pinjamanList = await prisma.pinjaman.findMany({ 
    where: { userId: session.userId, status: 'AKTIF' },
    include: { angsuran: true }
  })
  const pinjaman = pinjamanList.length > 0 ? pinjamanList[0] : null
  const belumLunas = pinjaman?.angsuran.filter(a => a.status === 'BELUM_LUNAS').sort((a,b) => a.angsuranKe - b.angsuranKe)
  const nextAngsuran = belumLunas && belumLunas.length > 0 ? belumLunas[0] : null
  
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f4', color: '#1a1a2e', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#1B5E20', color: 'white', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src="/koperasi logo.png" alt="Logo" style={{ width: '40px', borderRadius: '8px' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>SIMKOP-Link</h2>
        </div>
        <nav style={{ padding: '20px 0', flex: 1 }}>
          <a href="/anggota" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', color: 'white', textDecoration: 'none', fontWeight: 500, background: 'rgba(255,255,255,0.05)', borderLeft: '4px solid #F9A825' }}>
            Beranda Anggota
          </a>
          <a href="/" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, borderLeft: '4px solid transparent' }}>
            E-Catalog Produk
          </a>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={logout}>
            <button type="submit" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Keluar</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '30px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Dashboard Anggota</h1>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Selamat datang kembali, {session.nama.split(' ')[0]}!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{session.nama}</div>
              <div style={{ fontSize: '0.8rem', color: '#555' }}>Anggota Koperasi</div>
            </div>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
              {session.nama.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #4CAF50' }}>
            <div style={{ color: '#555', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Total Simpanan</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatRupiah(totalSimpanan)}</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #F9A825' }}>
            <div style={{ color: '#555', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Sisa Pinjaman Aktif</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatRupiah(pinjaman?.sisaSaldo || 0)}</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #2196F3' }}>
            <div style={{ color: '#555', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Estimasi SHU Tahun Ini</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatRupiah(450000)}</div> {/* Dummy SHU */}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Informasi Pinjaman Berjalan</div>
              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: pinjaman ? '#FFF8E1' : '#f4f4f4', color: pinjaman ? '#F57F17' : '#999' }}>
                {pinjaman ? 'Aktif' : 'Tidak Ada'}
              </span>
            </div>
            
            {pinjaman ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#555', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>No. Kontrak</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Jatuh Tempo</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Sisa Tenor</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Angsuran/Bulan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{pinjaman.nomor}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{nextAngsuran ? nextAngsuran.jatuhTempo.toLocaleDateString('id-ID') : '-'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{belumLunas?.length || 0} Bulan</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{nextAngsuran ? formatRupiah(nextAngsuran.nominal) : '-'}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Anda tidak memiliki pinjaman aktif saat ini.</div>
            )}
          </div>

          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '24px' }}>
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Rincian Simpanan</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed #eee' }}>
              <span style={{ color: '#555', fontSize: '0.9rem' }}>Simpanan Pokok</span>
              <span style={{ fontWeight: 600 }}>{formatRupiah(pokok)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed #eee' }}>
              <span style={{ color: '#555', fontSize: '0.9rem' }}>Simpanan Wajib</span>
              <span style={{ fontWeight: 600 }}>{formatRupiah(wajib)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed #eee' }}>
              <span style={{ color: '#555', fontSize: '0.9rem' }}>Simpanan Sukarela</span>
              <span style={{ fontWeight: 600 }}>{formatRupiah(sukarela)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', marginTop: '10px', borderTop: '2px solid #eee' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ color: '#388E3C', fontSize: '1.1rem', fontWeight: 700 }}>{formatRupiah(totalSimpanan)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
