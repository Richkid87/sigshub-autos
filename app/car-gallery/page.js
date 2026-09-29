'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CarCard from '../components/CarCard'
import WhatsAppFAB from '../components/WhatsAppFAB'
import { getAllCars } from '../lib/supabase'

const filters = {
  brand: ['All Brands', 'Toyota', 'Honda', 'Lexus', 'Mercedes', 'BMW', 'Range Rover', 'Ford'],
  bodyType: ['All Types', 'Sedan', 'SUV', 'Pickup', 'Hatchback', 'Coupe'],
  fuel: ['All Fuels', 'Petrol', 'Diesel', 'Hybrid', 'Electric'],
  transmission: ['All', 'Automatic', 'Manual'],
  priceRange: ['Any Price', 'Under ₦5M', '₦5M – ₦10M', '₦10M – ₦20M', '₦20M – ₦50M', 'Above ₦50M'],
}

export default function CarGalleryPage() {
  const [allCars, setAllCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState({
    brand: 'All Brands',
    bodyType: 'All Types',
    fuel: 'All Fuels',
    transmission: 'All',
    priceRange: 'Any Price',
  })
  const [sort, setSort] = useState('Newest First')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch all cars from Supabase when the gallery loads
  useEffect(() => {
    async function loadCars() {
      setLoading(true)
      const data = await getAllCars()
      setAllCars(data)
      setLoading(false)
    }
    loadCars()
  }, [])

  // Apply filters
  const filteredCars = allCars.filter((car) => {
    if (activeFilters.brand !== 'All Brands') {
      const brand = activeFilters.brand.toLowerCase()
      if (!car.name?.toLowerCase().includes(brand)) return false
    }
    if (activeFilters.bodyType !== 'All Types') {
      if (car.body_type !== activeFilters.bodyType) return false
    }
    if (activeFilters.fuel !== 'All Fuels') {
      if (car.fuel !== activeFilters.fuel) return false
    }
    if (activeFilters.transmission !== 'All') {
      if (car.transmission !== activeFilters.transmission) return false
    }
    return true
  })

  // Apply sorting
  const displayCars = [...filteredCars].sort((a, b) => {
    if (sort === 'Newest First') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    }
    return 0
  })

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      {/* Page Header */}
      <div className="pt-20 pb-8 px-4 bg-gradient-to-b from-brand-lavender to-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mt-6">
            <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-2">
              Stock updated: {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="font-jakarta font-bold text-3xl text-primary">Available Cars</h1>
            <p className="text-on-surface-variant text-sm mt-1">Updated regularly — new stock added weekly</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* ── SIDEBAR FILTERS (Desktop) ── */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-poppins font-semibold text-on-surface">Filter Cars</h3>
                <button
                  onClick={() => setActiveFilters({ brand: 'All Brands', bodyType: 'All Types', fuel: 'All Fuels', transmission: 'All', priceRange: 'Any Price' })}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>

              {Object.entries(filters).map(([key, options]) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <select
                    value={activeFilters[key]}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg text-sm p-2 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {options.map((opt) => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}

              <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-container transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ── MAIN GRID ── */}
          <div className="flex-1">
            {/* Sort + Count Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <p className="text-sm text-on-surface-variant">
                  Showing <span className="font-bold text-on-surface">{loading ? '…' : displayCars.length}</span> cars
                </p>
              </div>
              <div className="flex gap-3 items-center">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 border border-outline-variant px-3 py-2 rounded-lg text-sm text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">tune</span>
                  Filters
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white border border-outline-variant/50 rounded-lg text-sm p-2 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {['Newest First', 'Price: Low to High', 'Price: High to Low', 'Most Popular'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="md:hidden bg-white rounded-xl shadow-soft p-5 mb-6 grid grid-cols-2 gap-4">
                {Object.entries(filters).map(([key, options]) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <select
                      value={activeFilters[key]}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs p-2 text-on-surface"
                    >
                      {options.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Cars Grid */}
            {loading ? (
              <div className="text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl text-primary/30 animate-spin">autorenew</span>
                <p className="mt-4">Loading inventory...</p>
              </div>
            ) : displayCars.length === 0 ? (
              <div className="text-center py-20 bg-brand-lavender rounded-xl border-2 border-dashed border-primary/20">
                <span className="material-symbols-outlined text-5xl text-primary/30">directions_car</span>
                <p className="font-semibold text-on-surface mt-4">No cars found</p>
                <p className="text-on-surface-variant text-sm mt-1">Try clearing the filters or check back soon for new stock.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}

                {/* New stock hint */}
                <div className="bg-brand-lavender border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center p-8 text-center gap-3 min-h-[300px]">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">add</span>
                  </div>
                  <p className="font-inter font-semibold text-primary text-sm">New stock coming soon</p>
                  <p className="text-xs text-on-surface-variant">Check back regularly for new arrivals</p>
                </div>
              </div>
            )}

            {/* Load More — only show when there are cars */}
            {!loading && displayCars.length > 0 && (
              <div className="mt-10 text-center">
                <button className="border-2 border-primary text-primary px-10 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all">
                  Load More Cars
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
