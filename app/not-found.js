import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFAB from './components/WhatsAppFAB'

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page or vehicle you are looking for cannot be found. Browse our available cars or contact SigsHub Autos.',
}

export default function NotFound() {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-24 h-24 bg-brand-lavender rounded-3xl flex items-center justify-center mx-auto text-primary">
            <span className="material-symbols-outlined text-6xl">directions_car</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-widest">
              Lost in Traffic?
            </p>
            <h1 className="font-jakarta font-extrabold text-4xl md:text-5xl text-on-surface">
              Page Not Found
            </h1>
            <p className="text-on-surface-variant text-base max-w-md mx-auto pt-2">
              The page or vehicle you are looking for may have been sold, renamed, or moved. Let's get you back on the road.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/"
              className="bg-primary text-white py-3.5 px-6 rounded-xl font-poppins font-semibold shadow-soft hover:bg-primary-container transition-all"
            >
              Back to Home
            </Link>
            <Link
              href="/car-gallery"
              className="border-2 border-primary text-primary py-3.5 px-6 rounded-xl font-poppins font-semibold hover:bg-primary/10 transition-all"
            >
              Browse Car Gallery
            </Link>
          </div>

          <div className="pt-8 border-t border-outline-variant/30 text-xs text-outline">
            Need urgent help? <Link href="/bookings" className="text-primary font-semibold hover:underline">Book an inspection</Link> or reach out on WhatsApp.
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
