import { getPayload } from 'payload'
import config from '@/payload.config'
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'

const ACCESS_TOKEN_EXP = process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXP || '30d'
const REFRESH_TOKEN_EXP = process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXP || '7d'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    let loginResult
    try {
      loginResult = await payload.login({
        collection: 'users',
        data: { email: email.toLowerCase(), password },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const user = loginResult?.user
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const jwtSecret: Secret = process.env.NEXT_PUBLIC_JWT_SECRET || 'secret'

    const accessSignOptions: SignOptions = {
      expiresIn: ACCESS_TOKEN_EXP as SignOptions['expiresIn'],
    }

    const refreshSignOptions: SignOptions = {
      expiresIn: REFRESH_TOKEN_EXP as SignOptions['expiresIn'],
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, accessSignOptions)

    const refreshToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, refreshSignOptions)

    return new Response(
      JSON.stringify({
        accessToken,
        refreshToken: `Bearer ${refreshToken}`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
