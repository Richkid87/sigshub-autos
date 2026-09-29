'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getAllCars, addCar, updateCar, deleteCar, markAsSold, uploadCarImage, deleteCarImage } from '../../lib/supabase'

const EMPTY_CAR = {
  name: '', year: '', price: '', mileage: '', fuel: 'Petrol',
  transmission: 'Automatic', body_type: 'Sedan', badge: '',
  description: '', image_url: '', featured: false, available: true,
}

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const TRANSMISSIONS = ['Automatic', 'Manual']
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Van']
const BADGES = ['', 'Just In', 'Hot Deal', 'Price Drop']

export default function AdminDashboard() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState('grid') // grid | form | edit
  const [editCar, setEditCar] = useState(null)
  const [form, setForm] = useState(EMPTY_CAR)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadProgress, setUploadProgress] = useState(false)
  const [toast, setToast] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const fileRef = useRef()
  const router = useRouter()

  useEffect(() => { loadCars() }, [])

  async function loadCars() {
    setLoading(true)
    const data = await getAllCars()
    setCars(data)
    setLoading(false)
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function openAddForm() {
    setForm(EMPTY_CAR)
    setEditCar(null)
    setImageFile(null)
    setImagePreview('')
    setView('form')
  }

  function openEditForm(car) {
    setForm({ ...car })
    setEditCar(car)
    setImagePreview(car.image_url || '')
    setImageFile(null)
    setView('form')
  }

  function handleImageSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB', 'error'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.year) {
      showToast('Please fill in Name, Year and Price', 'error'); return
    }
    setSaving(true)
    try {
      let imageUrl = form.image_url

      // Upload new image if selected
      if (imageFile) {
        setUploadProgress(true)
        imageUrl = await uploadCarImage(imageFile)
        setUploadProgress(false)
        if (!imageUrl) {
          // Upload failed — inform admin and abort save so image_url is not null
          showToast('❌ Image upload failed. Check your Supabase storage bucket permissions and try again.', 'error')
          setSaving(false)
          return
        }
        // Delete old image if editing and a new one was uploaded successfully
        if (editCar?.image_url) await deleteCarImage(editCar.image_url)
      }

      const payload = { ...form, image_url: imageUrl }
      delete payload.id
      delete payload.created_at

      if (editCar) {
        const result = await updateCar(editCar.id, payload)
        if (!result) throw new Error('Update returned no data — check Supabase RLS policies')
        showToast('Car updated successfully! ✅')
      } else {
        const result = await addCar(payload)
        if (!result) throw new Error('Insert returned no data — check Supabase RLS policies')
        showToast('New car added! 🚗')
      }

      await loadCars()
      setView('grid')
    } catch (err) {
      showToast('❌ ' + (err.message || 'Error saving car'), 'error')
    }
    setSaving(false)
  }

  async function handleDelete(car) {
    try {
      await deleteCar(car.id)
      if (car.image_url) await deleteCarImage(car.image_url)
      showToast('Car removed from inventory')
      setConfirmDelete(null)
      await loadCars()
    } catch (err) {
      showToast('❌ ' + (err.message || 'Error deleting car'), 'error')
    }
  }

  async function handleMarkSold(car) {
    try {
      await markAsSold(car.id)
      showToast(`${car.name} marked as sold`)
      await loadCars()
    } catch (err) {
      showToast('❌ ' + (err.message || 'Error updating car'), 'error')
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  const filtered = cars.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' ? true
      : filterStatus === 'available' ? c.available
      : filterStatus === 'sold' ? !c.available
      : filterStatus === 'featured' ? c.featured
      : true
    return matchSearch && matchStatus
  })

  const stats = {
    total: cars.length,
    available: cars.filter(c => c.available).length,
    sold: cars.filter(c => !c.available).length,
    featured: cars.filter(c => c.featured).length,
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-card text-sm font-semibold flex items-center gap-2 transition-all ${
          toast.type === 'error' ? 'bg-error text-white' : 'bg-primary text-white'
        }`}>
          <span className="material-symbols-outlined text-sm fill-icon">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-soft p-6 max-w-sm w-full space-y-4">
            <div className="w-12 h-12 bg-error-container rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-error fill-icon">delete</span>
            </div>
            <div className="text-center">
              <h3 className="font-jakarta font-bold text-lg text-on-surface">Remove this car?</h3>
              <p className="text-on-surface-variant text-sm mt-1">
                <strong>{confirmDelete.name}</strong> will be permanently removed from your inventory.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="border border-outline-variant py-2 rounded-lg text-sm font-semibold text-on-surface">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="bg-error text-white py-2 rounded-lg text-sm font-semibold">
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-outline-variant sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {view !== 'grid' && (
              <button onClick={() => setView('grid')}
                className="p-2 rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-primary">arrow_back</span>
              </button>
            )}
            <div>
              <h1 className="font-jakarta font-bold text-lg text-primary">SigsHub Admin Dashboard</h1>
              <p className="text-xs text-on-surface-variant">
                {view === 'grid' ? 'Inventory Dashboard' : editCar ? `Editing: ${editCar.name}` : 'Add New Car'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {view === 'grid' && (
              <button onClick={openAddForm}
                className="bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Car
              </button>
            )}
            <button onClick={handleLogout}
              className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error-container/30">
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── GRID VIEW ── */}
        {view === 'grid' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Cars', value: stats.total, icon: 'directions_car', color: 'bg-primary' },
                { label: 'Available', value: stats.available, icon: 'check_circle', color: 'bg-green-500' },
                { label: 'Sold', value: stats.sold, icon: 'sell', color: 'bg-brand-gold' },
                { label: 'Featured', value: stats.featured, icon: 'star', color: 'bg-secondary' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl shadow-soft p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="material-symbols-outlined text-white fill-icon">{s.icon}</span>
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-2xl text-on-surface">{s.value}</p>
                    <p className="text-xs text-on-surface-variant">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by car name..."
                  className="w-full border border-outline-variant/50 rounded-lg text-sm py-2.5 pl-9 pr-4 focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-outline-variant/50 rounded-lg text-sm p-2.5 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="all">All Cars</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            {/* Cars Grid */}
            {loading ? (
              <div className="text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl text-primary/30 animate-spin">autorenew</span>
                <p className="mt-4">Loading inventory...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-5xl text-primary/30">directions_car</span>
                <p className="font-semibold text-on-surface mt-4">No cars found</p>
                <p className="text-on-surface-variant text-sm mt-1">Add your first car to get started</p>
                <button onClick={openAddForm}
                  className="mt-4 bg-primary text-white px-6 py-2 rounded-full font-semibold text-sm">
                  Add First Car
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((car) => (
                  <div key={car.id} className={`bg-white rounded-xl shadow-soft overflow-hidden border ${
                    !car.available ? 'border-outline-variant opacity-70' : 'border-outline-variant/30'
                  }`}>
                    {/* Image */}
                    <div className="relative h-40 bg-surface-container">
                      {car.image_url ? (
                        <img src={car.image_url} alt={car.name || 'Vehicle photo'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-lavender">
                          <span className="material-symbols-outlined text-primary/30 text-4xl">directions_car</span>
                        </div>
                      )}
                      {/* Status overlay for sold cars */}
                      {!car.available && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-white text-on-surface text-xs font-bold px-3 py-1 rounded-full">SOLD</span>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {car.featured && (
                          <span className="bg-brand-gold text-white text-[9px] px-2 py-0.5 rounded-full font-bold">★ FEATURED</span>
                        )}
                        {car.badge && (
                          <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{car.badge}</span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-jakarta font-semibold text-sm text-on-surface">{car.name}</h3>
                        <p className="text-xs text-on-surface-variant">{car.year} · {car.mileage}</p>
                      </div>
                      <p className="text-brand-gold font-bold text-base font-poppins">{car.price}</p>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-1 pt-1">
                        <button onClick={() => openEditForm(car)}
                          className="flex flex-col items-center gap-1 py-2 rounded-lg bg-surface-container-low hover:bg-brand-lavender transition-colors">
                          <span className="material-symbols-outlined text-primary text-sm">edit</span>
                          <span className="text-[9px] font-bold text-primary">Edit</span>
                        </button>
                        {car.available ? (
                          <button onClick={() => handleMarkSold(car)}
                            className="flex flex-col items-center gap-1 py-2 rounded-lg bg-surface-container-low hover:bg-secondary-fixed transition-colors">
                            <span className="material-symbols-outlined text-secondary text-sm">sell</span>
                            <span className="text-[9px] font-bold text-secondary">Sold</span>
                          </button>
                        ) : (
                          <button onClick={() => updateCar(car.id, { available: true, badge: '' }).then(loadCars).catch(err => showToast('❌ ' + err.message, 'error'))}
                            className="flex flex-col items-center gap-1 py-2 rounded-lg bg-surface-container-low hover:bg-green-50 transition-colors">
                            <span className="material-symbols-outlined text-green-600 text-sm">refresh</span>
                            <span className="text-[9px] font-bold text-green-600">Relist</span>
                          </button>
                        )}
                        <button onClick={() => setConfirmDelete(car)}
                          className="flex flex-col items-center gap-1 py-2 rounded-lg bg-surface-container-low hover:bg-error-container transition-colors">
                          <span className="material-symbols-outlined text-error text-sm">delete</span>
                          <span className="text-[9px] font-bold text-error">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Car slot */}
                <button onClick={openAddForm}
                  className="border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 p-8 hover:border-primary hover:bg-brand-lavender/50 transition-all min-h-[280px]">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">add</span>
                  </div>
                  <p className="font-semibold text-primary text-sm">Add New Car</p>
                </button>
              </div>
            )}
          </>
        )}

        {/* ── ADD / EDIT FORM VIEW ── */}
        {view === 'form' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
              <h2 className="font-jakarta font-bold text-xl text-on-surface">
                {editCar ? `Edit: ${editCar.name}` : 'Add New Car'}
              </h2>

              {/* Image Upload */}
              <div>
                <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-2">
                  Car Photo
                </label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="relative h-52 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant cursor-pointer hover:border-primary hover:bg-brand-lavender/30 transition-all overflow-hidden"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Vehicle image preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-semibold text-sm flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">upload</span>
                          Change Photo
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <span className="material-symbols-outlined text-primary/40 text-5xl">add_photo_alternate</span>
                      <p className="text-sm font-semibold text-primary">Click to upload car photo</p>
                      <p className="text-xs text-on-surface-variant">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                  {uploadProgress && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <p className="text-primary font-semibold text-sm animate-pulse">Uploading photo...</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Car Name */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Car Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Toyota Corolla LE"
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Year *</label>
                  <input
                    value={form.year}
                    onChange={(e) => setForm(p => ({ ...p, year: e.target.value }))}
                    placeholder="e.g. 2019"
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Price (₦) *</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="e.g. ₦12,500,000"
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low"
                  />
                </div>

                {/* Mileage */}
                <div>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Mileage</label>
                  <input
                    value={form.mileage}
                    onChange={(e) => setForm(p => ({ ...p, mileage: e.target.value }))}
                    placeholder="e.g. 45k Miles"
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low"
                  />
                </div>

                {/* Body Type */}
                <div>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Body Type</label>
                  <select value={form.body_type} onChange={(e) => setForm(p => ({ ...p, body_type: e.target.value }))}
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none">
                    {BODY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Fuel */}
                <div>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Fuel Type</label>
                  <select value={form.fuel} onChange={(e) => setForm(p => ({ ...p, fuel: e.target.value }))}
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none">
                    {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Transmission</label>
                  <select value={form.transmission} onChange={(e) => setForm(p => ({ ...p, transmission: e.target.value }))}
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none">
                    {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Badge */}
                <div>
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Badge Label</label>
                  <select value={form.badge} onChange={(e) => setForm(p => ({ ...p, badge: e.target.value }))}
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 bg-surface-container-low focus:ring-2 focus:ring-primary focus:outline-none">
                    {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the car condition, features, history..."
                    rows={3}
                    className="w-full border border-outline-variant/50 rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:outline-none bg-surface-container-low resize-none"
                  />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex gap-6">
                  {[
                    { field: 'available', label: 'Available for Sale', icon: 'check_circle' },
                    { field: 'featured', label: 'Show on Homepage', icon: 'star' },
                  ].map(({ field, label, icon }) => (
                    <label key={field} className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setForm(p => ({ ...p, [field]: !p[field] }))}
                        className={`w-11 h-6 rounded-full transition-colors relative ${form[field] ? 'bg-primary' : 'bg-outline-variant'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[field] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                      <span className="text-sm font-medium text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-primary">{icon}</span>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setView('grid')}
                  className="flex-1 border border-outline-variant py-3 rounded-xl font-semibold text-sm text-on-surface hover:bg-surface-container transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-container transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm fill-icon">save</span>
                      {editCar ? 'Save Changes' : 'Add to Inventory'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
