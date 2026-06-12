'use client'

import { useState } from 'react'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const [role, setRole] = useState<'anggota' | 'admin'>('anggota')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(formData: FormData) {
    formData.append('role', role)
    const res = await login(formData)
    if (res?.error) {
      setErrorMsg(res.error)
    }
  }

  return (
    <div style={{
      background: '#f7faf7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: 'white', width: '100%', maxWidth: '420px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #2E7D32, #43A047)', padding: '40px 30px 30px', textAlign: 'center', color: 'white', position: 'relative'
        }}>
          <div style={{
            width: '70px', height: '70px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', padding: '10px'
          }}>
            <img src="/koperasi logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>SIMKOP-Link</h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '5px' }}>Sistem Informasi Koperasi Digital</p>
        </div>
        
        <div style={{ padding: '10px 30px 40px' }}>
          <div style={{ display: 'flex', background: '#E8F5E9', borderRadius: '12px', padding: '4px', marginBottom: '25px' }}>
            <div 
              onClick={() => setRole('anggota')}
              style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#2E7D32', borderRadius: '8px', cursor: 'pointer', background: role === 'anggota' ? 'white' : 'transparent', boxShadow: role === 'anggota' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}>
              Anggota
            </div>
            <div 
              onClick={() => setRole('admin')}
              style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#2E7D32', borderRadius: '8px', cursor: 'pointer', background: role === 'admin' ? 'white' : 'transparent', boxShadow: role === 'admin' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}>
              Pengurus / Admin
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500, marginBottom: '20px', background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2' }}>
              {errorMsg}
            </div>
          )}

          <form action={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Username</label>
              <input 
                type="text" 
                name="username"
                placeholder={role === 'anggota' ? "Username (contoh: sukarman)" : "Username (contoh: admin)"}
                required
                style={{ width: '100%', padding: '12px 15px', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="Masukkan password"
                required
                style={{ width: '100%', padding: '12px 15px', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#F9A825', color: '#1B5E20', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}>
              Masuk ke Dashboard
            </button>
          </form>

          <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>
            Kembali ke Beranda Katalog
          </a>
        </div>
      </div>
    </div>
  )
}
