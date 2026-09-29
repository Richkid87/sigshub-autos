/**
 * seed-cars.mjs
 * Seeds Supabase with the existing hardcoded cars from app/data/cars.js
 * so they become fully manageable from the admin backend.
 * Run: node seed-cars.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseEnv(content) {
  return Object.fromEntries(
    content.split(/\r?\n/).filter(l => l && !l.startsWith('#')).map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx), l.slice(idx + 1)]
    })
  )
}

const envPath = path.join(__dirname, '.env.local')
if (!fs.existsSync(envPath)) throw new Error('.env.local not found')
const env = parseEnv(fs.readFileSync(envPath, 'utf8'))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// All real cars from the static cars.js file — now seeded into Supabase
// so they are fully editable from the admin dashboard.
const CARS_TO_SEED = [
  {
    name: 'Toyota Corolla LE',
    year: '2018',
    price: '₦12,500,000',
    mileage: '45k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Sedan',
    description: 'Well-maintained Toyota Corolla LE in excellent condition.',
    badge: null,
    available: true,
    featured: true,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgaQtsIoHxo6RHc2Nq17R4z61toN-5kgBjWwbf1m481X8inGTmS-vW9BBq5xNIh2N6DO7-wgJd1ZAGnqMfnWTNzDz4t6QUZTYwy97dUB8O5khqAwykj2AMLRDAR9k4nre1gWu1DUQI48nG06IyUZZ4ZO-XwY54EDcnJFjyHc28Icrc8r9u0wofaIcPX1bAkVVKqyVo8TYpiRJ7LBvLO8V4e6g3gDjx1rQ_Nw6thUGQu0gAQtjkkKv_6ssKziRMlmXlDfsEc7Hf5KYZ',
  },
  {
    name: 'Lexus RX 350',
    year: '2021',
    price: '₦45,000,000',
    mileage: '12k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    body_type: 'SUV',
    description: 'Stunning 2021 Lexus RX 350. Barely used, full options.',
    badge: 'Just In',
    available: true,
    featured: true,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwcClkBvqtdSJKa0vGMKlWCrxJVvz6R5Scuz4A-uqkOLF3W6HLhYXEsTVLlolvXEiaZuQzAK-o4dYhoTjk0ZRiKy0IM992qHh04Mism8yOgOSX6dB8eEoE1yqssYocDb9sCwFvfhR4u34PwoNfZMTKq0Abj3RutDm6K2HLzquE54LHc8gfTNmVwyoKkbsWovkEBxSU5r7NxRMrcwMQzxHn5_EfnJY27WBOvYUkOZFZ3vFnyXzrsChsM7cLItOECLUKNw-jWlX4BPx8',
  },
  {
    name: 'Mercedes C300',
    year: '2019',
    price: '₦24,500,000',
    mileage: '38k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Sedan',
    description: 'Mercedes-Benz C300 in pristine condition. Drives like new.',
    badge: null,
    available: true,
    featured: true,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-A8VnBpGvgj_Py78XLgOOML4TKTtK0_J5XtwVeUjyspgm2ifFFkBIhH0wcstwqvj3hA6_e_rHpsrwZfbM3h5zxHgE-Cyik7teBo1dAjqCnKCjsW9iVCc2VgrXeaGcHCWcNW0jLjgIdPdKhAcIq9P0_nMHKfhTDJ6iZxG6l3HzFcS5DdE8BaNFvf7yYcxNfYf6wrWSa--ccDcyuX6GwyuOSMuCRPFvP1CNTsUHtM458gMMQkBPwmpVi-7FCutSMzxTLG1Iqop9yXwI',
  },
  {
    name: 'Honda Accord',
    year: '2017',
    price: '₦8,500,000',
    mileage: '62k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Sedan',
    description: 'Reliable Honda Accord with full service history.',
    badge: 'Just In',
    available: true,
    featured: false,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfaEqxAdPmN7FY0rIetjYVrzJdwGfJOIGtxZ_r7k1Zk2WRYmj60ZeuWKaXTL2UoWqk9W8WpTas-CNCM_ume_-3d4kGSv39TtfdQj_LBmqi3HKb0h1Xp6EHvDyVYt9iI2fNxmHc2HN_7Beq8LoPDzuo0erNCbc_yuUDK1aNN0BXlO0Oa1CgkN7FEK1-vM1KuGnjsr_NfV8-OwQ0I3FWnKKEd0vYtfmXqLJhLFNIMt8ctWWv8ly0soQjuMQ0RIOAkgCapVyMuGBuZJ-r',
  },
  {
    name: 'Range Rover Sport',
    year: '2020',
    price: '₦68,000,000',
    mileage: '21k Miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    body_type: 'SUV',
    description: 'Top-of-the-line Range Rover Sport. Low mileage, fully loaded.',
    badge: 'Just In',
    available: true,
    featured: false,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhj6cvy-tMXrwlS-Y4OXCU8GPBeD56itR-9307ymuwek6tmwtDbAKckwwcPsXv89ABKqm3voLk86vtLtVdO1A-PJ341zDQ2Bxrq_4CO-RMwK6zMO4UiMpCxgbuFqrubTcUgHsnAd5Om8h-6YSDsJWqFaZy4-yPVYoOr-ACcYnCpX24K7zhlnx8lW8qIG9fkzGk4EJQcw06JVqmmWsjPj0GUhZCF5S638vXlvTYEX-KMbG7T4fxc-Hp5cB3AditNcAtr0aFQUYot_Vx',
  },
]

async function seedCars() {
  console.log('🚗 Starting car seeding...\n')

  for (const car of CARS_TO_SEED) {
    // Check if a car with this name + year already exists to avoid duplicates
    const { data: existing } = await supabase
      .from('cars')
      .select('id, name, year')
      .eq('name', car.name)
      .eq('year', car.year)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log(`⏭  Skipped (already exists): ${car.name} (${car.year})`)
      continue
    }

    const { data, error } = await supabase
      .from('cars')
      .insert([car])
      .select('id, name, year')

    if (error) {
      console.error(`❌ Failed to insert ${car.name}:`, error.message)
    } else {
      console.log(`✅ Inserted: ${data[0].name} (${data[0].year}) — id: ${data[0].id}`)
    }
  }

  // Final count
  const { data: all } = await supabase.from('cars').select('id, name, year, featured')
  console.log(`\n📊 Total cars in database: ${all?.length ?? 0}`)
  all?.forEach(c => console.log(`   ${c.featured ? '⭐' : '  '} [${c.id}] ${c.name} (${c.year})`))
  console.log('\n✨ Seeding complete! All cars are now editable from the admin backend.')
}

seedCars().catch(err => {
  console.error('Seed failed:', err.message || err)
  process.exit(1)
})
