import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // Clear all auth cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // Remove all Supabase auth cookies
    allCookies.forEach((cookie) => {
      if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
        cookieStore.delete(cookie.name)
      }
    })
    
    const response = NextResponse.json({ success: true })
    
    // Set cookie headers to expire auth cookies
    response.cookies.set({
      name: 'sb-access-token',
      value: '',
      maxAge: 0,
    })
    response.cookies.set({
      name: 'sb-refresh-token',
      value: '',
      maxAge: 0,
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
