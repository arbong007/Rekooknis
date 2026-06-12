'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from './prisma'

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const roleStr = formData.get('role') as string

  // username here acts as NIK or username mapped to nama for simplicity. 
  // In mockups, admin used "admin" and anggota used "sukarman". 
  // Let's allow case-insensitive match on `nama` or `nik`.
  
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { nik: username },
        { nama: { equals: username } } // Note: MySQL is usually case-insensitive by default
      ],
      password: password,
      role: roleStr === 'admin' ? 'ADMIN' : 'ANGGOTA'
    }
  })

  if (!user) {
    return { error: 'Username atau password salah!' }
  }

  // Create simple session cookie
  cookies().set('session', JSON.stringify({
    userId: user.id,
    nama: user.nama,
    role: user.role
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  })

  if (user.role === 'ADMIN') {
    redirect('/admin')
  } else {
    redirect('/anggota')
  }
}

export async function logout() {
  cookies().delete('session')
  redirect('/login')
}

export async function getSession() {
  const sessionData = cookies().get('session')?.value
  if (!sessionData) return null
  return JSON.parse(sessionData) as { userId: string, nama: string, role: string }
}
