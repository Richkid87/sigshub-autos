'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    setLoading(false)

    if (res.ok) {
      sessionStorage.setItem('sigshub_admin', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EFFF] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-[#7B5EA7] mb-2 text-center">
          SigsHub Autos
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Admin Access
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B5EA7]"
          required
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7B5EA7] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  )
}