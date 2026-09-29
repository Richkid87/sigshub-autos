const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 * Contains a timestamp and HMAC signature using the admin password/secret.
 */
export async function createSessionToken(secret) {
  if (!secret) throw new Error('Secret key is required to create session token')
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const timestamp = Date.now().toString()
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(timestamp))
  const sigHex = Array.from(new Uint8Array(sigBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return `${timestamp}.${sigHex}`
}

/**
 * Verifies the HMAC-SHA256 session token and checks expiration.
 * Returns true if valid and not expired, false otherwise.
 */
export async function verifySessionToken(token, secret) {
  if (!token || typeof token !== 'string' || !secret) return false
  const [timestamp, sigHex] = token.split('.')
  if (!timestamp || !sigHex) return false

  const time = parseInt(timestamp, 10)
  if (isNaN(time)) return false

  const age = Date.now() - time
  if (age < 0 || age > SESSION_TTL_MS) return false

  try {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const match = sigHex.match(/.{1,2}/g)
    if (!match) return false
    const sigBytes = new Uint8Array(match.map(byte => parseInt(byte, 16)))
    return await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(timestamp))
  } catch {
    return false
  }
}
