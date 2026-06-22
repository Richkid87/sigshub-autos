import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <span className="font-jakarta font-bold text-xl text-primary">SigsHub Autos</span>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Nigeria's Trusted Auto Partner. Providing quality vehicles and peace of mind since 2020.
            </p>
            <a
              href="https://wa.me/2347018910972"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              WhatsApp Us
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-poppins font-semibold text-on-surface">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/car-gallery', label: 'Browse Cars' },
                { href: '/bookings', label: 'Book Appointment' },
                { href: '/about', label: 'About Us' },
                { href: '/about', label: 'Contact Us' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-poppins font-semibold text-on-surface">Contact</h4>
            <div className="space-y-3">
              <p className="text-on-surface-variant text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-primary mt-0.5">location_on</span>
                69/71, Dottem Bees Plaza, Moshood Abiola Way, Olorunsogo, Abeokuta, Ogun State, Nigeria
              </p>
              <p className="text-on-surface-variant text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                Mon – Sat: 8am – 6pm
              </p>
              <p className="text-on-surface-variant text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">mail</span>
                info@sigshub.com
              </p>
              <p className="text-secondary font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">chat</span>
                2347018910972
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-xs">© 2024 SigsHub Autos. Nigeria's Trusted Auto Partner.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-on-surface-variant hover:text-primary text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-on-surface-variant hover:text-primary text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
