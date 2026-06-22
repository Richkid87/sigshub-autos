'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Incorrect password. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lavender to-surface flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-soft p-8 w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-white text-3xl fill-icon">admin_panel_settings</span>
          </div>
          <h1 className="font-jakarta font-bold text-xl text-primary">SigsHub Admin</h1>
          <p className="text-on-surface-variant text-sm">Enter your password to manage inventory</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
              Admin Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">lock</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 pl-9 pr-4 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low"
              />
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container text-sm px-3 py-2 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>
        </form>

        <p className="text-center text-xs text-outline">
          This area is restricted to SigsHub Autos staff only.
        </p>
      </div>
    </div>
  )
}
