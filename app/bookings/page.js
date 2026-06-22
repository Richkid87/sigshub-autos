'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppFAB from '../components/WhatsAppFAB'
import { allCars } from '../data/cars'

const STEPS = ['Select Car', 'Appointment Type', 'Date & Time', 'Your Details', 'Confirm']

const appointmentTypes = [
  { id: 'test-drive', icon: 'directions_car', title: 'Test Drive', desc: 'Experience the car on the road before buying' },
  { id: 'inspection', icon: 'search', title: 'Vehicle Inspection', desc: 'Full technical check by our certified team' },
  { id: 'consultation', icon: 'handshake', title: 'Purchase Consultation', desc: 'Discuss pricing, financing, and availability' },
]

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM',
]

const nigerianStates = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Kano', 'Oyo', 'Anambra',
  'Delta', 'Ogun', 'Enugu', 'Kaduna', 'Cross River', 'Other',
]

function generateRef() {
  return 'SHA-' + Math.floor(10000 + Math.random() * 90000)
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export default function BookingsPage() {
  const today = new Date()
  const [step, setStep] = useState(1)
  const [bookingRef] = useState(generateRef())
  const [form, setForm] = useState({
    carId: '',
    appointmentType: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    state: '',
    message: '',
  })
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const selectedCar = allCars.find(c => String(c.id) === String(form.carId))

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const canProceed = () => {
    if (step === 1) return !!form.carId
    if (step === 2) return !!form.appointmentType
    if (step === 3) return !!form.date && !!form.time
    if (step === 4) return !!form.name && !!form.phone && !!form.email
    return true
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="pt-20 pb-8 px-4 bg-gradient-to-b from-brand-lavender to-surface">
        <div className="max-w-2xl mx-auto mt-6 text-center">
          <h1 className="font-jakarta font-bold text-3xl text-primary">Book an Appointment</h1>
          <p className="text-on-surface-variant text-sm mt-2">
            Schedule a test drive or inspection at your convenience
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Progress Bar */}
        {step <= 5 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i + 1 < step
                      ? 'bg-primary text-white'
                      : i + 1 === step
                      ? 'bg-brand-gold text-on-secondary-fixed'
                      : 'bg-surface-container text-outline'
                  }`}>
                    {i + 1 < step
                      ? <span className="material-symbols-outlined text-sm">check</span>
                      : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block text-center ${
                    i + 1 === step ? 'text-primary' : 'text-outline'
                  }`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="relative h-1.5 bg-surface-container rounded-full">
              <div
                className="absolute h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 1: Select Car ── */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
            <div>
              <h2 className="font-jakarta font-bold text-xl text-on-surface">Select a Car</h2>
              <p className="text-on-surface-variant text-sm mt-1">Choose the vehicle you're interested in</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-2">
                Available Cars
              </label>
              <select
                value={form.carId}
                onChange={(e) => updateForm('carId', e.target.value)}
                className="w-full border border-outline-variant/50 rounded-lg text-sm p-3 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low"
              >
                <option value="">Search or select a car...</option>
                {allCars.filter(c => c.name !== '[Car Name]').map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} ({car.year}) — {car.price}
                  </option>
                ))}
              </select>
            </div>

            {selectedCar && (
              <div className="bg-brand-lavender rounded-lg p-4 flex gap-4 items-center">
                {selectedCar.image && (
                  <img src={selectedCar.image} alt={selectedCar.name} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-on-surface text-sm">{selectedCar.name}</p>
                  <p className="text-xs text-on-surface-variant">{selectedCar.year} · {selectedCar.mileage} · {selectedCar.transmission}</p>
                  <p className="text-brand-gold font-bold text-sm mt-1">{selectedCar.price}</p>
                </div>
              </div>
            )}

            <div className="pt-2 text-center text-xs text-on-surface-variant">
              Don't see your car?{' '}
              <a href="https://wa.me/2347018910972" className="text-primary font-semibold">Contact us on WhatsApp</a>
            </div>
          </div>
        )}

        {/* ── STEP 2: Appointment Type ── */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
            <div>
              <h2 className="font-jakarta font-bold text-xl text-on-surface">Appointment Type</h2>
              <p className="text-on-surface-variant text-sm mt-1">What would you like to do?</p>
            </div>
            <div className="space-y-3">
              {appointmentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateForm('appointmentType', type.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    form.appointmentType === type.id
                      ? 'border-primary bg-brand-lavender'
                      : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      form.appointmentType === type.id ? 'bg-primary text-white' : 'bg-surface-container text-primary'
                    }`}>
                      <span className="material-symbols-outlined">{type.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface text-sm">{type.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{type.desc}</p>
                    </div>
                    {form.appointmentType === type.id && (
                      <span className="material-symbols-outlined text-primary ml-auto fill-icon">check_circle</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Date & Time ── */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
            <div>
              <h2 className="font-jakarta font-bold text-xl text-on-surface">Pick Date & Time</h2>
              <p className="text-on-surface-variant text-sm mt-1">Choose a convenient slot</p>
            </div>

            {/* Calendar */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => {
                    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
                    else setCurrentMonth(m => m - 1)
                  }}
                  className="p-2 rounded-full hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="font-semibold text-on-surface">{monthName} {currentYear}</span>
                <button
                  onClick={() => {
                    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
                    else setCurrentMonth(m => m + 1)
                  }}
                  className="p-2 rounded-full hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-outline">{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const date = new Date(currentYear, currentMonth, day)
                  const isToday = date.toDateString() === today.toDateString()
                  const isPast = date < today && !isToday
                  const isSunday = date.getDay() === 0
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const isSelected = form.date === dateStr
                  const disabled = isPast || isSunday

                  return (
                    <button
                      key={day}
                      disabled={disabled}
                      onClick={() => updateForm('date', dateStr)}
                      className={`w-full aspect-square rounded-full text-xs font-medium transition-all ${
                        disabled
                          ? 'text-outline/40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary text-white font-bold'
                          : isToday
                          ? 'bg-brand-lavender text-primary font-bold border border-primary'
                          : 'hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-outline mt-2">* Sundays unavailable</p>
            </div>

            {/* Time Slots */}
            <div>
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-3">
                Available Time Slots
              </label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => updateForm('time', slot)}
                    className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all ${
                      form.time === slot
                        ? 'bg-primary text-white border-primary'
                        : 'border-outline-variant/50 text-on-surface hover:border-primary hover:text-primary'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Your Details ── */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
            <div>
              <h2 className="font-jakarta font-bold text-xl text-on-surface">Your Details</h2>
              <p className="text-on-surface-variant text-sm mt-1">We'll use this to confirm your booking</p>
            </div>

            <div className="space-y-4">
              {[
                { field: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Tunde Adeyemi', icon: 'person' },
                { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+234 800 000 0000', icon: 'phone' },
                { field: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: 'mail' },
              ].map(({ field, label, type, placeholder, icon }) => (
                <div key={field}>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">{label}</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">{icon}</span>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={(e) => updateForm(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 pl-9 pr-4 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low placeholder:text-outline"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">State / Location</label>
                <select
                  value={form.state}
                  onChange={(e) => updateForm('state', e.target.value)}
                  className="w-full border border-outline-variant/50 rounded-lg text-sm p-3 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low"
                >
                  <option value="">Select your state</option>
                  {nigerianStates.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Additional Message (Optional)</label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateForm('message', e.target.value)}
                  placeholder="Any specific questions or requirements?"
                  rows={3}
                  className="w-full border border-outline-variant/50 rounded-lg text-sm p-3 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low resize-none placeholder:text-outline"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Confirmation ── */}
        {step === 5 && (
          <div className="bg-white rounded-xl shadow-soft p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-green-600 text-4xl fill-icon">check_circle</span>
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-2xl text-on-surface">Booking Confirmed!</h2>
              <p className="text-on-surface-variant text-sm mt-2">We'll contact you shortly to confirm your appointment.</p>
            </div>

            <div className="bg-brand-lavender rounded-xl p-5 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                <span className="text-xs text-outline uppercase tracking-wider font-bold">Booking Reference</span>
                <span className="font-bold text-primary font-poppins">{bookingRef}</span>
              </div>
              {[
                ['Car Selected', selectedCar?.name || 'N/A'],
                ['Appointment', appointmentTypes.find(t => t.id === form.appointmentType)?.title || '—'],
                ['Date', form.date ? new Date(form.date + 'T12:00:00').toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                ['Time', form.time || '—'],
                ['Name', form.name],
                ['Phone', form.phone],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">{label}</span>
                  <span className="font-medium text-on-surface">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/2347018910972?text=Hi SigsHub! My booking ref is ${bookingRef}. I booked a ${appointmentTypes.find(t => t.id === form.appointmentType)?.title} for ${selectedCar?.name} on ${form.date} at ${form.time}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Confirm via WhatsApp
              </a>
              <Link
                href="/"
                className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 border border-outline-variant px-6 py-3 rounded-full text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back
              </button>
            ) : <div />}

            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                canProceed()
                  ? 'bg-primary text-white hover:bg-primary-container'
                  : 'bg-surface-container text-outline cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Review Booking' : 'Continue'}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
