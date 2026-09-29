import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

// Safe initialization — won't crash the module if env vars are missing during
// local dev without a .env.local file; errors surface at query time instead.
let supabase
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase env vars not set. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    // ⬇ CRITICAL FIX: prevent Next.js from caching Supabase fetch() calls
    // on the server.  Without this, server components (homepage, car detail)
    // return stale data and admin changes never appear on the public site.
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, { ...options, cache: 'no-store' })
      },
    },
  })
} catch (e) {
  console.error('[supabase.js]', e.message)
  supabase = null
}

export { supabase }

// ── Public homepage helpers ──────────────────────────────────

export async function getFeaturedCars() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('featured', true)
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(6)
  if (error) { console.error('[getFeaturedCars]', error); return [] }
  return data ?? []
}

export async function getLatestArrivals() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(3)
  if (error) { console.error('[getLatestArrivals]', error); return [] }
  return data ?? []
}

// ── Admin helpers ──────────────────────────────────────────
// Write operations now THROW on failure so the admin dashboard
// can display real error messages instead of showing false success.

export async function getAllCars() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('[getAllCars]', error); return [] }
  return data ?? []
}

export async function getCarById(id) {
  if (!supabase || !id) return null
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()
  if (error) { console.error('[getCarById]', error); return null }
  return data ?? null
}

export async function addCar(car) {
  if (!supabase) throw new Error('Database connection not available')
  const { data, error } = await supabase
    .from('cars')
    .insert([car])
    .select()
  if (error) throw new Error(error.message)
  return data[0]
}

export async function updateCar(id, updates) {
  if (!supabase) throw new Error('Database connection not available')
  const { data, error } = await supabase
    .from('cars')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw new Error(error.message)
  return data[0]
}

export async function deleteCar(id) {
  if (!supabase) throw new Error('Database connection not available')
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

export async function markAsSold(id) {
  if (!supabase) throw new Error('Database connection not available')
  const { data, error } = await supabase
    .from('cars')
    .update({ available: false })
    .eq('id', id)
    .select()
  if (error) throw new Error(error.message)
  return data[0]
}

// ── Image upload helpers ─────────────────────────────────────

/**
 * Sanitize a filename so Supabase storage accepts it:
 * replaces spaces with underscores and strips non-alphanumeric characters
 * (except dots, dashes, underscores).
 */
function sanitizeFileName(name) {
  return name
    .replace(/\s+/g, '_')           // spaces → underscores
    .replace(/[^a-zA-Z0-9._-]/g, '') // strip special chars
    .toLowerCase()
}

export async function uploadCarImage(file) {
  if (!supabase) return null
  const safeName = sanitizeFileName(file.name)
  const fileName = `cars/${Date.now()}-${safeName}`
  const { data, error } = await supabase.storage
    .from('car-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })
  if (error) {
    console.error('[uploadCarImage] Upload failed:', error.message)
    return null
  }
  const { data: urlData } = supabase.storage
    .from('car-images')
    .getPublicUrl(fileName)
  return urlData?.publicUrl ?? null
}

export async function deleteCarImage(imageUrl) {
  if (!supabase || !imageUrl) return
  // Extract path after bucket name
  const match = imageUrl.match(/car-images\/(.+)$/)
  const path = match ? match[1] : null
  if (!path) return
  const { error } = await supabase.storage.from('car-images').remove([path])
  if (error) console.error('[deleteCarImage]', error)
}