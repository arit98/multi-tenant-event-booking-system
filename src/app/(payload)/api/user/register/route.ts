import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const { email, password, name, role, tenant_id } = await req.json()

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email.toLowerCase() } },
    })
    if (
      existing &&
      (Array.isArray(existing) ? existing.length > 0 : (existing as any).totalDocs > 0)
    ) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Creating payload
    const created = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        password,
        name,
        role: role || 'attendee',
        tenant_id: tenant_id || null,
      },
    })

    return new Response(JSON.stringify({ message: 'User registered', id: created.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Register error', err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
