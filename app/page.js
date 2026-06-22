import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CarCard from './components/CarCard'
import WhatsAppFAB from './components/WhatsAppFAB'
import { getFeaturedCars, getLatestArrivals } from './lib/supabase'

const whyItems = [
  { icon: 'verified', label: 'Verified Used Cars', desc: 'Every car thoroughly inspected' },
  { icon: 'payments', label: 'Flexible Payment', desc: 'Options to fit your budget' },
  { icon: 'assignment_turned_in', label: 'Free Inspection', desc: 'Book at no cost to you' },
  { icon: 'local_shipping', label: 'Nationwide Delivery', desc: 'We deliver across Nigeria' },
]

const testimonials = [
  { id: 1, text: 'Bought my first car here. Process was seamless and the inspection report was very accurate!', name: 'Tunde', city: 'Lagos', stars: 5 },
  { id: 2, text: 'Excellent customer service. They handled the delivery to Abuja perfectly.', name: 'Chidi', city: 'Abuja', stars: 5 },
  { id: 3, text: 'Great selection at very fair prices. The booking process was super easy.', name: 'Amaka', city: 'Port Harcourt', stars: 5 },
]

export const revalidate = 60

export default async function HomePage() {
  const [featuredCars, latestArrivals] = await Promise.all([
    getFeaturedCars(),
    getLatestArrivals(),
  ])

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-brand-lavender via-surface-container-low to-surface">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <p className="text-primary font-poppins font-semibold tracking-widest uppercase text-xs">Your Trusted Nigerian Car Dealer</p>
          <h1 className="font-jakarta font-bold text-3xl md:text-5xl text-on-surface leading-tight">
            Find Your Perfect<br /><span className="text-primary">Ride in Nigeria</span>
          </h1>
          <p className="text-on-surface-variant font-inter px-4 text-base">Quality used cars at the best prices — Lagos & beyond</p>
          <div className="flex flex-col sm:flex-row gap-3 px-4 justify-center">
            <Link href="/car-gallery" className="bg-primary text-white py-4 px-8 rounded-full font-poppins font-semibold shadow-soft active:scale-95 transition-all hover:bg-primary-container">Browse Cars</Link>
            <Link href="/bookings" className="border-2 border-brand-gold text-secondary py-4 px-8 rounded-full font-poppins font-semibold active:scale-95 transition-all hover:bg-brand-gold/10">Book a Test Drive</Link>
          </div>
          <div className="flex justify-center gap-8 pt-4">
            {[['500+','Cars Sold'],['3+','Years'],['5★','Rating']].map(([num,label])=>(
              <div key={label} className="text-center">
                <p className="font-poppins font-bold text-xl text-primary">{num}</p>
                <p className="text-xs text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 -mt-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-card p-5 border border-outline-variant/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[{label:'Make',options:['Any Make','Toyota','Honda','Lexus','Mercedes','BMW']},{label:'Model',options:['Any Model','Corolla','Accord','RX 350','C300']},{label:'Budget (₦)',options:['Any Price','Under ₦5M','₦5M–₦10M','₦10M–₦20M','Above ₦20M']},{label:'Body Type',options:['Any Type','Sedan','SUV','Pickup','Hatchback']}].map((f)=>(
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-outline uppercase tracking-wider">{f.label}</label>
                <select className="bg-surface-container-low border border-outline-variant/50 rounded-lg text-sm p-2 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none">
                  {f.options.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <Link href="/car-gallery" className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-sm">search</span>Search Vehicles
          </Link>
        </div>
      </section>

      <section className="py-14 overflow-hidden">
        <div className="px-4 max-w-7xl mx-auto mb-6 flex justify-between items-end">
          <div><h2 className="font-jakarta font-bold text-2xl text-primary">Featured Cars</h2><div className="h-1 w-12 bg-brand-gold rounded-full mt-1"/></div>
          <Link href="/car-gallery" className="text-primary font-semibold text-sm hover:underline">See All →</Link>
        </div>
        {featuredCars.length === 0 ? (
          <div className="px-4 max-w-7xl mx-auto text-center py-12 bg-brand-lavender rounded-xl border-2 border-dashed border-primary/20">
            <p className="text-on-surface-variant text-sm">No featured cars yet. <Link href="/admin/dashboard" className="text-primary font-semibold">Add in Admin →</Link></p>
          </div>
        ) : (
          <>
            <div className="md:hidden flex overflow-x-auto gap-4 px-4 hide-scrollbar snap-x snap-mandatory">
              {featuredCars.map(car=><div key={car.id} className="min-w-[280px] snap-start flex-shrink-0"><CarCard car={car}/></div>)}
            </div>
            <div className="hidden md:grid grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
              {featuredCars.map(car=><CarCard key={car.id} car={car}/>)}
            </div>
          </>
        )}
      </section>

      <section className="py-14 bg-surface-container-low px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10"><h2 className="font-jakarta font-bold text-2xl text-primary">Why SigsHub Autos?</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {whyItems.map(item=>(
              <div key={item.label} className="bg-white p-5 rounded-lg shadow-soft text-center space-y-2 flex flex-col items-center hover:shadow-card transition-shadow">
                <div className="w-12 h-12 bg-brand-lavender rounded-full flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-primary fill-icon">{item.icon}</span>
                </div>
                <h4 className="font-inter font-semibold text-sm text-on-surface leading-tight">{item.label}</h4>
                <p className="text-xs text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div><h2 className="font-jakarta font-bold text-2xl text-primary">Latest Arrivals</h2><div className="h-1 w-12 bg-brand-gold rounded-full mt-1"/></div>
            <span className="bg-primary text-white text-[10px] px-3 py-1 rounded-full animate-pulse font-semibold">JUST IN</span>
          </div>
          {latestArrivals.length === 0 ? (
            <div className="bg-brand-lavender rounded-xl p-10 text-center border-2 border-dashed border-primary/20">
              <p className="text-on-surface-variant text-sm">No cars yet. Add inventory from your admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestArrivals.map(car=><CarCard key={car.id} car={car}/>)}
            </div>
          )}
          <Link href="/car-gallery" className="w-full mt-8 border-2 border-primary text-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
            Explore All Inventory<span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      <section className="py-14 bg-brand-lavender overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10"><h2 className="font-jakarta font-bold text-2xl text-primary">What Our Clients Say</h2></div>
          <div className="flex overflow-x-auto gap-6 hide-scrollbar snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
            {testimonials.map(t=>(
              <div key={t.id} className="min-w-[300px] md:min-w-0 bg-white p-6 rounded-xl shadow-soft snap-center">
                <div className="flex gap-1 text-brand-gold mb-3">{Array.from({length:t.stars}).map((_,i)=><span key={i} className="material-symbols-outlined text-sm fill-icon">star</span>)}</div>
                <p className="italic text-on-surface-variant text-sm mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center"><span className="font-bold text-primary text-sm">{t.name[0]}</span></div>
                  <div><p className="font-bold text-on-surface text-sm">{t.name} from {t.city}</p><p className="text-xs text-outline">Verified Buyer</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-jakarta font-bold text-2xl text-white">Ready to Drive Your Dream Car?</h2>
          <p className="text-white/80 text-sm">Book a free inspection appointment today. No commitment required.</p>
          <Link href="/bookings" className="inline-block bg-brand-gold text-on-secondary-fixed px-8 py-4 rounded-full font-poppins font-bold hover:shadow-gold transition-all active:scale-95">Book Free Inspection</Link>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
