'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const router = useRouter()

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      setShowError(true)
      const timer = setTimeout(() => {
        setShowError(false)
        setTimeout(() => setError(''), 300) // Clear after fade out
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowError(false)

    try {
      // Validate environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration is missing. Please check your environment variables.')
      }

      // Create browser client for auth
      const supabase = createBrowserClient(supabaseUrl, supabaseKey)
      
      // Sign in with password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        
        // Provide user-friendly error messages
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before logging in.')
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      if (!data.session) {
        setError('Login failed - no session created. Please try again.')
        setLoading(false)
        return
      }

      // Successfully logged in
      console.log('Login successful, redirecting to admin...')
      
      // Wait a moment for cookies to be set, then do a full page reload
      // This ensures the admin layout picks up the new session immediately
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Use window.location for a full page reload to ensure session is picked up
      window.location.href = '/admin'
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading tracking-widest text-gold-shine mb-2">
            TAG
          </h1>
          <p className="text-white/60">Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="border border-white/10 rounded-lg p-8 bg-zinc-950">
          <h2 className="text-2xl font-heading text-white mb-6">
            Sign In
          </h2>

          {/* Error Alert with Animation */}
          {error && (
            <div 
              className={`mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm transition-all duration-300 ${
                showError ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
              role="alert"
            >
              <div className="flex items-start gap-3">
                <svg 
                  className="w-5 h-5 flex-shrink-0 mt-0.5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Login Failed</p>
                  <p className="text-red-300/90">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-black border border-white/20 text-white focus:border-gold focus:outline-none transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-black border border-white/20 text-white focus:border-gold focus:outline-none transition-colors"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold-gradient text-black rounded font-semibold hover:shadow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/60 text-sm text-center">
              Secure admin access only
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/60 hover:text-gold transition-colors text-sm">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  )
}
