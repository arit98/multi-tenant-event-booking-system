import { getPayload } from 'payload'
import config from '@/payload.config'

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

    // Use the token returned by Payload's login so `payload.auth` will accept it
    const accessToken = loginResult?.token

    return new Response(
      JSON.stringify({
        accessToken,
        user,
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
