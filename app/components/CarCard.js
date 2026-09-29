import Link from 'next/link'
import Image from 'next/image'

export default function CarCard({ car }) {
  const {
    id = 1,
    name = '[Car Name]',
    year = '2020',
    price = '₦0,000,000',
    mileage = '— mi',
    fuel = 'Petrol',
    transmission = 'Automatic',
    image = null,
    image_url = null,
    badge = null,
    available = true,
  } = car || {}

  // Normalize: admin saves as image_url; static data uses image
  const displayImage = image_url || image || null

  return (
    <div className="bg-white rounded-lg shadow-soft border border-outline-variant/30 overflow-hidden flex flex-col transition-all duration-200 card-hover group">
      {/* Image Area */}
      <div className="relative h-52 md:h-60 lg:h-64 bg-surface-container flex-shrink-0 overflow-hidden">
        {displayImage ? (
          // Use a standard <img> tag so any URL (Supabase storage, external,
          // blob, data URI) renders without Next.js domain/format restrictions.
          <img
            src={displayImage}
            alt={`${year ? year + ' ' : ''}${name || 'Car'}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Placeholder when no image has been uploaded yet */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-container to-brand-lavender">
            <span className="material-symbols-outlined text-primary-fixed-dim text-4xl">directions_car</span>
            <span className="text-[10px] text-outline uppercase tracking-wider font-semibold">[CAR IMAGE]</span>
          </div>
        )}

        {/* Year Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm">
          {year}
        </span>

        {/* Status Badge */}
        {badge && (
          <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
            badge === 'Just In'
              ? 'bg-primary text-white'
              : badge === 'Reserved'
              ? 'bg-amber-500 text-white'
              : 'bg-green-500 text-white'
          }`}>
            {badge}
          </span>
        )}

        {/* Availability overlay */}
        {!available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-on-surface text-xs font-bold px-3 py-1 rounded-full">Reserved</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <h3 className="font-jakarta font-semibold text-lg text-on-surface leading-tight">
          {name}
        </h3>

        {/* Spec Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-brand-lavender text-primary px-2 py-1 rounded text-[10px] font-medium">{mileage}</span>
          <span className="bg-brand-lavender text-primary px-2 py-1 rounded text-[10px] font-medium">{fuel}</span>
          <span className="bg-brand-lavender text-primary px-2 py-1 rounded text-[10px] font-medium">{transmission}</span>
        </div>

        {/* Price */}
        <p className="text-brand-gold font-bold text-lg font-poppins">{price}</p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 mt-auto">
          <Link
            href={`/car-gallery/${id}`}
            className="border border-primary text-primary py-2 rounded-lg text-xs font-bold text-center hover:bg-primary hover:text-white transition-colors"
          >
            Details
          </Link>
          <Link
            href={`/bookings?car=${encodeURIComponent(name)}`}
            className="bg-primary text-white py-2 rounded-lg text-xs font-bold text-center hover:bg-primary-container transition-colors"
          >
            Book Inspection
          </Link>
        </div>
      </div>
    </div>
  )
}
