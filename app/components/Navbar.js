'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/car-gallery', label: 'Buy Cars', icon: 'directions_car' },
  { href: '/bookings', label: 'Book Appointment', icon: 'calendar_month' },
  { href: '/about', label: 'Contact Us', icon: 'chat' },
]

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-outline-variant/30 shadow-soft">
        <nav className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-150 md:hidden"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
            <Link href="/" className="font-jakarta font-bold text-xl text-primary tracking-tight">
              SigsHub Autos
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-inter text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/bookings"
            className="bg-brand-gold text-on-secondary-fixed px-5 py-2 rounded-full font-poppins font-semibold text-sm active:scale-95 transition-all duration-150 hover:shadow-gold"
          >
            Book Now
          </Link>
        </nav>
      </header>

      {/* Mobile Side Drawer */}
      <div
        className={`fixed inset-0 z-[60] transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />

        {/* Drawer Panel */}
        <div className="relative bg-surface h-full w-80 shadow-xl flex flex-col py-4">
          <div className="px-6 pb-6 border-b border-outline-variant flex justify-between items-center">
            <span className="font-jakarta font-bold text-lg text-primary">SigsHub Menu</span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-1 mt-4 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className={`rounded-lg px-4 py-3 flex items-center gap-3 transition-colors ${
                  pathname === link.href
                    ? 'bg-primary-container text-white'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{link.icon}</span>
                <span className="font-inter font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="mt-auto px-6 pb-6">
            <div className="bg-brand-lavender rounded-xl p-4">
              <p className="text-xs text-on-surface-variant mb-1">Need help?</p>
              <a
                href="https://wa.me/2347018910972"
                className="flex items-center gap-2 text-sm font-semibold text-primary"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
