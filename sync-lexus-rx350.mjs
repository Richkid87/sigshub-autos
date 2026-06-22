import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parseEnv(content) {
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const idx = line.indexOf('=')
        const key = line.slice(0, idx)
        const value = line.slice(idx + 1)
        return [key, value]
      })
  )
}

const envPath = path.join(__dirname, '.env.local')
if (!fs.existsSync(envPath)) {
  throw new Error('.env.local not found in project root')
}

const env = parseEnv(fs.readFileSync(envPath, 'utf8'))
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const carData = {
  name: 'Lexus RX350',
  year: '2010',
  price: '₦20,000,000',
  mileage: '—',
  fuel: 'Petrol',
  transmission: 'Automatic',
  body_type: 'SUV',
  description: 'Smooth and stylish Lexus RX350 with a V6 engine. Luxury SUV in great condition. DM now and drive away today!',
  badge: 'Just In',
  available: true,
  featured: true,
  image_url: null,
}

async function run() {
  console.log('Checking for existing Lexus RX350...')
  const { data: existing, error: queryError } = await supabase
    .from('cars')
    .select('*')
    .eq('name', carData.name)
    .eq('year', carData.year)
    .limit(1)

  if (queryError) {
    throw queryError
  }

  if (existing && existing.length > 0) {
    console.log('Existing record found. Updating instead of inserting...')
    const existingId = existing[0].id
    const { data, error } = await supabase
      .from('cars')
      .update(carData)
      .eq('id', existingId)
      .select()
    if (error) throw error
    console.log('Updated car:', data[0])
    return
  }

  console.log('Inserting new car into Supabase...')
  const { data, error } = await supabase
    .from('cars')
    .insert([carData])
    .select()

  if (error) throw error
  console.log('Inserted car:', data[0])
}

run().catch(err => {
  console.error('Sync failed:', err.message || err)
  process.exit(1)
})
