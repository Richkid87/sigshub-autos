export async function POST(request) {
  const { password } = await request.json()

  if (password === process.env.ADMIN_PASSWORD) {
    return Response.json({ success: true })
  }

  return Response.json({ success: false }, { status: 401 })
}