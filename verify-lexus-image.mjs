import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function parseEnv(content) {
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const idx = line.indexOf('=')
        return [line.slice(0, idx), line.slice(idx + 1)]
      })
  )
}

async function main() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) throw new Error('.env.local not found')

  const env = parseEnv(fs.readFileSync(envPath, 'utf8'))
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('name', 'Lexus RX350')
    .eq('year', '2010')
    .limit(1)

  if (error) throw error
  if (!data || data.length === 0) {
    console.log('No Lexus RX350 record found.')
    process.exit(1)
  }

  const car = data[0]
  console.log('Record found:')
  console.log(JSON.stringify({
    id: car.id,
    name: car.name,
    year: car.year,
    price: car.price,
    badge: car.badge,
    available: car.available,
    featured: car.featured,
    image_url: car.image_url,
  }, null, 2))

  if (car.image_url) {
    const response = await fetch(car.image_url)
    console.log('Image fetch status:', response.status, response.statusText)
  }
}

main().catch((err) => {
  console.error('Verification failed:', err.message || err)
  process.exit(1)
})