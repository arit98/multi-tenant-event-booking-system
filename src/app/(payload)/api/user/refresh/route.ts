import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json()
    if (!refreshToken) {
      return new Response(JSON.stringify({ error: 'Missing refreshToken' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = refreshToken.replace(/^Bearer\s+/i, '')
    try {
      const decoded: any = jwt.verify(token, process.env.NEXT_PUBLIC_PAYLOAD_SECRET || 'secret')
      const newAccess = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.NEXT_PUBLIC_PAYLOAD_SECRET || 'secret',
        { expiresIn: '15m' },
      )
      return new Response(JSON.stringify({ accessToken: newAccess }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid refresh token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (err) {
    console.error('Refresh error', err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
