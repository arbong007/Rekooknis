import prisma from '@/lib/prisma'

export default async function LandingPage() {
  const produkList = await prisma.produk.findMany()

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1a1a2e' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/koperasi logo.png" alt="Logo" style={{ height: '40px' }} />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#2E7D32' }}>SIMKOP-Link</h1>
            <p style={{ fontSize: '0.8rem', margin: 0, color: '#555' }}>Koperasi Agro Mulyo Lestari</p>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>Beranda</a>
          <a href="#katalog" style={{ textDecoration: 'none', color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>E-Catalog</a>
          <a href="/login" style={{ padding: '10px 20px', background: '#F9A825', color: '#1B5E20', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>Login Anggota</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #43A047 100%)', color: 'white', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Sistem Informasi Koperasi Digital Terpadu</h2>
        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px', opacity: 0.9, lineHeight: 1.6 }}>Meningkatkan kesejahteraan anggota melalui layanan simpan pinjam yang transparan dan e-catalog produk pertanian yang lengkap.</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <a href="/login" style={{ padding: '14px 28px', background: '#F9A825', color: '#1B5E20', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>Masuk Portal Anggota</a>
          <a href="#katalog" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>Lihat Produk Kami</a>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="katalog" style={{ padding: '60px 5%', background: '#f9fbf9' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1B5E20' }}>E-Catalog Produk Koperasi</h2>
          <p style={{ color: '#555', marginTop: '10px' }}>Temukan berbagai kebutuhan sarana produksi pertanian dan hasil bumi unggulan.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {produkList.map((p) => (
            <div key={p.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s' }}>
              <div style={{ height: '200px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: '4rem', opacity: 0.5 }}>🌱</span>
                <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#FFF8E1', color: '#F57F17', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {p.kategori}
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '5px' }}>{p.kode}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{p.nama}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <div>
                    <div style={{ color: '#555', fontSize: '0.85rem' }}>Harga Anggota</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2E7D32' }}>{formatRupiah(p.harga)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#555', fontSize: '0.85rem' }}>Stok</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{p.stok} unit</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a2e', color: 'rgba(255,255,255,0.7)', padding: '40px 5%', textAlign: 'center', fontSize: '0.9rem' }}>
        <p>&copy; {new Date().getFullYear()} Koperasi Agro Mulyo Lestari - Sistem Informasi Manajemen Koperasi Digital.</p>
      </footer>
    </div>
  )
}
