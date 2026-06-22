'use client'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppFAB from '../components/WhatsAppFAB'

const stats = [
  { num: '20+', label: 'Cars Sold' },
  { num: '3+', label: 'Years in Business' },
  { num: 'Abeokuta', label: 'Based' },
  { num: '5★', label: 'Customer Rating' },
]

const subjects = ['General Inquiry', 'Car Availability', 'Appointment', 'Financing', 'Nationwide Delivery', 'Partnership']

export default function AboutPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const update = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="pt-20 pb-10 px-4 bg-gradient-to-b from-brand-lavender to-surface">
        <div className="max-w-3xl mx-auto mt-6 text-center">
          <h1 className="font-jakarta font-bold text-3xl text-primary">About SigsHub Autos</h1>
          <p className="text-on-surface-variant text-sm mt-2">Nigeria's most trusted used car partner</p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-widest mb-2">Our Story</p>
                <h2 className="font-jakarta font-bold text-2xl text-primary leading-tight">
                  Built on Trust, Driven by Quality
                </h2>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                SigsHub Autos was founded in Abeokuta with a simple mission: make buying a quality used car in Nigeria transparent, easy, and stress-free. We got tired of seeing buyers cheated by inaccurate listings and hidden problems.
              </p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Every car in our inventory goes through a rigorous verification process. We provide accurate condition reports, fair pricing, and support from first inquiry all the way to delivery at your doorstep.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm fill-icon">verified</span>
                </div>
                <p className="text-sm font-semibold text-on-surface">Every car verified before listing</p>
              </div>
            </div>

            {/* Team Photo Placeholder */}
            <div className="bg-brand-lavender rounded-2xl h-64 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/20">
              <span className="material-symbols-outlined text-primary/40 text-5xl">group</span>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">[Team Photo]</p>
              <p className="text-[10px] text-outline">Upload via backend CMS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-10 bg-primary px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-poppins font-bold text-3xl text-brand-gold">{s.num}</p>
              <p className="text-white/80 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-jakarta font-bold text-2xl text-primary">Get In Touch</h2>
            <p className="text-on-surface-variant text-sm mt-2">We're happy to help with any questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-green-600 text-3xl fill-icon">check_circle</span>
                  </div>
                  <h3 className="font-jakarta font-bold text-lg text-on-surface">Message Sent!</h3>
                  <p className="text-on-surface-variant text-sm">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-jakarta font-bold text-lg text-on-surface mb-4">Send a Message</h3>
                  {[
                    { field: 'name', label: 'Your Name', type: 'text', placeholder: 'Tunde Adeyemi', icon: 'person' },
                    { field: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: 'mail' },
                    { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: '2347018910972', icon: 'phone' },
                  ].map(({ field, label, type, placeholder, icon }) => (
                    <div key={field}>
                      <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">{label}</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">{icon}</span>
                        <input
                          type={type}
                          required
                          value={form[field]}
                          onChange={(e) => update(field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 pl-9 pr-4 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low placeholder:text-outline"
                        />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      required
                      className="w-full border border-outline-variant/50 rounded-lg text-sm p-3 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      required
                      placeholder="Tell us how we can help..."
                      rows={4}
                      className="w-full border border-outline-variant/50 rounded-lg text-sm p-3 text-on-surface focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low resize-none placeholder:text-outline"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Panel */}
            <div className="space-y-6">
              {/* Info Cards */}
              {[
                { icon: 'location_on', title: 'Visit Us', lines: ['69/71, Dottem Bees Plaza, Moshood Abiola Way, Olorunsogo, Abeokuta, Ogun State, Nigeria'] },
                { icon: 'schedule', title: 'Business Hours', lines: ['Monday – Friday: 8am – 6pm', 'Saturday: 9am – 4pm', 'Sunday: Closed'] },
                { icon: 'mail', title: 'Email Us', lines: ['info@sigshub.com'] },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl shadow-soft p-5 flex gap-4">
                  <div className="w-10 h-10 bg-brand-lavender rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm fill-icon">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{item.title}</p>
                    {item.lines.map(l => (
                      <p key={l} className="text-on-surface-variant text-xs mt-0.5">{l}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/2347018910972"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#25D366] text-white rounded-xl p-5 hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div>
                    <p className="font-bold">Chat on WhatsApp</p>
                    <p className="text-white/80 text-sm">2347018910972</p>
                    <p className="text-white/70 text-xs mt-1">Typically replies within minutes</p>
                  </div>
                </div>
              </a>

              {/* Map Placeholder */}
              <div className="bg-brand-lavender rounded-xl h-48 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/20">
                <span className="material-symbols-outlined text-primary/40 text-4xl">map</span>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">[Google Maps Embed]</p>
                <p className="text-[10px] text-outline">Add your Google Maps iframe here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
