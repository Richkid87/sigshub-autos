import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import WhatsAppFAB from '../../components/WhatsAppFAB'
import { getCarById, getFeaturedCars } from '../../lib/supabase'

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const id = resolvedParams?.id
  const car = await getCarById(id)

  if (!car) {
    return {
      title: 'Car Not Found | SigsHub Autos',
      description: 'The requested vehicle is not available in our current inventory.',
    }
  }

  const title = `${car.year} ${car.name} for Sale in Nigeria | SigsHub Autos`
  const description = `Buy ${car.year} ${car.name} for ${car.price} at SigsHub Autos Nigeria. Transmission: ${car.transmission}, Fuel: ${car.fuel}, Mileage: ${car.mileage || 'Low mileage'}. Inspected & verified.`
  const image = car.image_url || '/og-image.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://sigshubautos.com/car-gallery/${car.id}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${car.year} ${car.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function CarDetailPage({ params }) {
  const resolvedParams = await params
  const id = resolvedParams?.id
  const [car, featuredCars] = await Promise.all([
    getCarById(id),
    getFeaturedCars(),
  ])

  if (!car) {
    return (
      <div className="bg-surface min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 px-4 flex items-center justify-center">
          <div className="text-center py-16 px-8 max-w-md bg-white rounded-2xl shadow-soft border border-outline-variant/30 space-y-4">
            <span className="material-symbols-outlined text-outline text-6xl">no_crash</span>
            <h1 className="text-2xl font-bold font-jakarta text-on-surface">Car Not Found</h1>
            <p className="text-on-surface-variant text-sm">
              This vehicle may have been sold or removed from our inventory.
            </p>
            <div className="pt-2">
              <Link
                href="/car-gallery"
                className="inline-block bg-primary text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-primary-container transition-colors"
              >
                Browse Available Cars
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppFAB />
      </div>
    )
  }

  const displayImage = car.image_url || car.image || null
  const relatedCars = (featuredCars || [])
    .filter(c => String(c.id) !== String(id))
    .slice(0, 3)

  // Sanitize database values before embedding in JSON-LD to prevent XSS.
  // Strips HTML tags and escapes characters that could break out of a
  // <script> block (e.g. </script> injections).
  function sanitize(str) {
    if (typeof str !== 'string') return str
    return str
      .replace(/<[^>]*>/g, '')              // strip HTML tags
      .replace(/<\//g, '<\\/')             // escape closing script tags
      .replace(/[\u2028\u2029]/g, '')       // strip line/paragraph separators
  }

  // Structured Data (JSON-LD) for Schema.org/Car
  const carStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: sanitize(`${car.year} ${car.name}`),
    image: displayImage ? [displayImage] : ['https://sigshubautos.com/og-image.png'],
    description: sanitize(car.description || `${car.year} ${car.name} available at SigsHub Autos Nigeria.`),
    modelDate: sanitize(car.year),
    vehicleTransmission: sanitize(car.transmission),
    fuelType: sanitize(car.fuel),
    bodyType: sanitize(car.body_type),
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: car.price ? car.price.replace(/[^0-9]/g, '') || '0' : '0',
      availability: car.available ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      seller: {
        '@type': 'AutoDealer',
        name: 'SigsHub Autos',
      },
    },
  }

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carStructuredData) }}
      />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-outline mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/car-gallery" className="hover:text-primary transition-colors">Car Gallery</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">{car.name}</span>
          </nav>

          <div className="space-y-12">
            {/* Main Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Image Section */}
              <div className="lg:col-span-7 bg-white rounded-2xl overflow-hidden shadow-soft border border-outline-variant/30">
                <div className="relative h-72 sm:h-96 md:h-[420px] bg-surface-container overflow-hidden">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={`${car.year || ''} ${car.name || 'Vehicle'}`.trim()}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-container to-brand-lavender">
                      <span className="material-symbols-outlined text-primary-fixed-dim text-6xl">directions_car</span>
                      <span className="text-xs text-outline uppercase tracking-wider font-semibold">No Image Available</span>
                    </div>
                  )}

                  {/* Year badge */}
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface shadow">
                    {car.year}
                  </span>

                  {/* Badge */}
                  {car.badge && (
                    <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow text-white ${
                      car.badge === 'Just In'
                        ? 'bg-primary'
                        : car.badge === 'Reserved'
                        ? 'bg-amber-500'
                        : 'bg-green-600'
                    }`}>
                      {car.badge}
                    </span>
                  )}

                  {!car.available && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                        Sold / Reserved
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-outline-variant/30 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-lavender text-primary uppercase">
                        {car.body_type || 'Vehicle'}
                      </span>
                      {car.featured && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-800">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Single H1 Tag */}
                    <h1 className="text-2xl sm:text-3xl font-bold font-jakarta text-on-surface">
                      {car.name}
                    </h1>

                    <p className="text-2xl sm:text-3xl font-extrabold text-brand-gold font-poppins mt-2">
                      {car.price}
                    </p>
                  </div>

                  <hr className="border-outline-variant/30" />

                  {/* Key Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-surface flex flex-col">
                      <span className="text-xs text-outline font-medium">Year</span>
                      <span className="font-semibold text-on-surface mt-0.5">{car.year}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface flex flex-col">
                      <span className="text-xs text-outline font-medium">Mileage</span>
                      <span className="font-semibold text-on-surface mt-0.5">{car.mileage || 'Low Mileage'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface flex flex-col">
                      <span className="text-xs text-outline font-medium">Transmission</span>
                      <span className="font-semibold text-on-surface mt-0.5">{car.transmission}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface flex flex-col">
                      <span className="text-xs text-outline font-medium">Fuel Type</span>
                      <span className="font-semibold text-on-surface mt-0.5">{car.fuel}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {car.description && (
                    <div className="space-y-2">
                      <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide">Vehicle Description</h2>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {car.description}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <Link
                      href={`/bookings?car=${encodeURIComponent(car.name)}`}
                      className="w-full block text-center bg-primary text-white font-bold py-3.5 px-6 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
                    >
                      Book Inspection / Test Drive
                    </Link>

                    <a
                      href={`https://wa.me/2347018910972?text=${encodeURIComponent(`Hello, I am interested in the ${car.year} ${car.name} listed for ${car.price}. Is it available?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 border border-green-600 text-green-700 font-bold py-3.5 px-6 rounded-xl hover:bg-green-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">chat</span>
                      Inquire via WhatsApp
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Other Recommendations */}
            {relatedCars.length > 0 && (
              <div className="pt-8 border-t border-outline-variant/30 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-jakarta text-on-surface">You Might Also Like</h2>
                  <Link href="/car-gallery" className="text-xs font-semibold text-primary hover:underline">
                    View all cars →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedCars.map(c => (
                    <div key={c.id} className="bg-white rounded-xl shadow-soft border border-outline-variant/30 overflow-hidden flex flex-col">
                      <div className="h-44 bg-surface-container overflow-hidden relative">
                        <img
                          src={c.image_url || c.image}
                          alt={`${c.year || ''} ${c.name || 'Vehicle'}`.trim()}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded">
                          {c.year}
                        </span>
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-sm text-on-surface line-clamp-1">{c.name}</h3>
                          <p className="text-brand-gold font-bold text-sm">{c.price}</p>
                        </div>
                        <Link
                          href={`/car-gallery/${c.id}`}
                          className="text-xs font-bold text-primary border border-primary/30 rounded py-1.5 text-center hover:bg-primary hover:text-white transition-colors block mt-2"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
