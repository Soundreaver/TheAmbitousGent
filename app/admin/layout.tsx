'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
        return
      }
      
      setUser(session?.user || null)
    } catch (error) {
      console.error('Auth check error:', error)
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      
      // Call logout API to clear server-side cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // Clear user state
      setUser(null)
      
      // Force hard refresh to clear all client state
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even on error
      window.location.href = '/admin/login'
    }
  }

  // Show loading while checking auth
  if (loading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Navigation */}
      {user && pathname !== '/admin/login' && (
        <nav className="border-b border-white/10 bg-zinc-950/50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/admin" className="text-2xl font-heading tracking-widest text-gold-shine">
                TAG Admin
              </Link>

              {/* Nav Links */}
              <div className="flex items-center gap-6">
                <Link
                  href="/admin"
                  className={`text-white/80 hover:text-gold transition-colors ${
                    pathname === '/admin' ? 'text-gold' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/posts"
                  className={`text-white/80 hover:text-gold transition-colors ${
                    pathname.startsWith('/admin/posts') ? 'text-gold' : ''
                  }`}
                >
                  Posts
                </Link>
                <Link
                  href="/admin/posts/new"
                  className="px-4 py-2 bg-gold-gradient text-black rounded font-medium hover:shadow-gold transition-all"
                >
                  New Post
                </Link>
                <Link
                  href="/"
                  className="text-white/60 hover:text-white transition-colors text-sm"
                >
                  View Site →
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/80 rounded hover:border-red-400/40 hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
