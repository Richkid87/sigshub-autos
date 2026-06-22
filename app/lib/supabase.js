import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Public homepage helpers ──────────────────────────────────

export async function getFeaturedCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6)
  if (error) { console.error(error); return [] }
  return data
}

export async function getLatestArrivals() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)
  if (error) { console.error(error); return [] }
  return data
}

// ── Admin helpers ──────────────────────────────────────────

export async function getAllCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data
}

export async function addCar(car) {
  const { data, error } = await supabase
    .from('cars')
    .insert([car])
    .select()
  if (error) { console.error(error); return null }
  return data[0]
}

export async function updateCar(id, updates) {
  const { data, error } = await supabase
    .from('cars')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) { console.error(error); return null }
  return data[0]
}

export async function deleteCar(id) {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id)
  if (error) { console.error(error); return false }
  return true
}

export async function markAsSold(id) {
  const { data, error } = await supabase
    .from('cars')
    .update({ available: false })
    .eq('id', id)
    .select()
  if (error) { console.error(error); return null }
  return data[0]
}

// ── Image upload helpers ─────────────────────────────────────

export async function uploadCarImage(file) {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('car-images')
    .upload(fileName, file)
  if (error) { console.error(error); return null }
  const { data: urlData } = supabase.storage
    .from('car-images')
    .getPublicUrl(fileName)
  return urlData.publicUrl
}

export async function deleteCarImage(imageUrl) {
  if (!imageUrl) return
  const path = imageUrl.split('/car-images/')[1]
  if (!path) return
  await supabase.storage.from('car-images').remove([path])
}