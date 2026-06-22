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
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const idx = line.indexOf('=')
        return [line.slice(0, idx), line.slice(idx + 1)]
      })
  )
}

function getArg(name) {
  const prefix = `--${name}=`
  const arg = process.argv.find((item) => item.startsWith(prefix))
  return arg ? arg.slice(prefix.length) : undefined
}

async function downloadFile(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download image: ${res.status} ${res.statusText}`)
  const buffer = await res.arrayBuffer()
  const contentType = res.headers.get('content-type') || ''
  let ext = ''
  if (contentType.includes('jpeg')) ext = 'jpg'
  else if (contentType.includes('png')) ext = 'png'
  else if (contentType.includes('webp')) ext = 'webp'
  else if (contentType.includes('gif')) ext = 'gif'
  else if (contentType.includes('svg')) ext = 'svg'
  else {
    const parsed = new URL(url)
    const name = path.basename(parsed.pathname)
    ext = name.includes('.') ? name.split('.').pop() : 'jpg'
  }
  return { buffer: Buffer.from(buffer), ext }
}

async function readLocalFile(filePath) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath)
  const buffer = await fs.promises.readFile(absolutePath)
  const ext = path.extname(absolutePath).slice(1) || 'jpg'
  return { buffer, ext }
}

async function main() {
  const envPath = path.join(__dirname, '.env.local')
  if (!fs.existsSync(envPath)) throw new Error('.env.local not found in project root')
  const env = parseEnv(await fs.promises.readFile(envPath, 'utf8'))
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing Supabase URL or anon key in .env.local')

  const imageUrl = getArg('url')
  const imageFile = getArg('file')
  if (!imageUrl && !imageFile) {
    throw new Error('Provide either --url=<imageUrl> or --file=<localPath>')
  }

  let imageData
  if (imageUrl) {
    imageData = await downloadFile(imageUrl)
  } else {
    imageData = await readLocalFile(imageFile)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: existing, error: queryError } = await supabase
    .from('cars')
    .select('*')
    .eq('name', 'Lexus RX350')
    .eq('year', '2010')
    .limit(1)

  if (queryError) throw queryError
  if (!existing || existing.length === 0) throw new Error('No Lexus RX350 record found in Supabase')

  const filename = `lexus_rx350_${Date.now()}.${imageData.ext}`
  const filepath = `cars/${filename}`
  const { error: uploadError } = await supabase.storage
    .from('car-images')
    .upload(filepath, imageData.buffer, { cacheControl: '3600', upsert: true })

  if (uploadError) throw uploadError

  const { data: publicData, error: urlError } = supabase.storage
    .from('car-images')
    .getPublicUrl(filepath)

  if (urlError) throw urlError
  const publicUrl = publicData?.publicUrl
  if (!publicUrl) throw new Error('Unable to generate public URL')

  const { data: updated, error: updateError } = await supabase
    .from('cars')
    .update({ image_url: publicUrl })
    .eq('id', existing[0].id)
    .select()

  if (updateError) throw updateError

  console.log('Uploaded image and updated Lexus RX350 record:')
  console.log('Public image URL:', publicUrl)
  console.log('Updated record id:', updated[0].id)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
