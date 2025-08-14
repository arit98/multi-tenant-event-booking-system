import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: Request) {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const { user } = await payload.auth({ headers: req.headers as any })

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let tenantId: string | number | null = null
    if (user.tenant_id) {
      if (typeof user.tenant_id === 'string' || typeof user.tenant_id === 'number') {
        tenantId = user.tenant_id
      } else if (typeof user.tenant_id === 'object' && 'id' in user.tenant_id) {
        tenantId = (user.tenant_id as any).id
      }
    }

    if (!tenantId) {
      return new Response(JSON.stringify({ error: 'No tenant associated with user' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Fetch events
    const [eventsRes, bookingsRes, bookingLogsRes] = await Promise.all([
      payload.find({
        collection: 'events',
        where: { tenant: { equals: tenantId } },
        sort: 'date',
        depth: 0,
      }),
      payload.find({ collection: 'bookings', where: { tenant: { equals: tenantId } }, depth: 0 }),
      payload.find({
        collection: 'bookingLogs',
        where: { tenant: { equals: tenantId } },
        sort: '-createdAt',
        limit: 5,
        depth: 1,
      }),
    ])

    const extractDocs = (res: any) => {
      if (Array.isArray(res)) return res
      if (res && Array.isArray(res.docs)) return res.docs
      return []
    }

    const events = extractDocs(eventsRes)
    const bookings = extractDocs(bookingsRes)
    const bookingLogs = extractDocs(bookingLogsRes)

    const now = new Date()

    const upcomingEvents = events
      .filter((ev: any) => {
        if (!ev.date) return false
        const evDate = new Date(ev.date)
        return evDate >= now
      })
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((ev: any) => {
        const eventId = typeof ev.id === 'string' ? ev.id : ev.id

        const relatedBookings = bookings.filter((b: any) => {
          const bEvent = typeof b.event === 'string' ? b.event : b.event?.id
          return bEvent === eventId
        })

        const confirmedCount = relatedBookings.filter((b: any) => b.status === 'confirmed').length
        const waitlistedCount = relatedBookings.filter((b: any) => b.status === 'waitlisted').length
        const canceledCount = relatedBookings.filter((b: any) => b.status === 'canceled').length

        const capacity = Number(ev.capacity) || 0
        const percentageFilled = capacity > 0 ? Math.round((confirmedCount / capacity) * 100) : 0

        return {
          id: eventId,
          title: ev.title,
          date: ev.date,
          capacity,
          confirmedCount,
          waitlistedCount,
          canceledCount,
          circularProgress: {
            percentageFilled,
          },
        }
      })

    const totalEvents = events.length
    const totalConfirmedBookings = bookings.filter((b: any) => b.status === 'confirmed').length
    const totalWaitlistedBookings = bookings.filter((b: any) => b.status === 'waitlisted').length
    const totalCanceledBookings = bookings.filter((b: any) => b.status === 'canceled').length

    const recentActivity = bookingLogs.slice(0, 5)

    const payloadResponse = {
      upcomingEvents,
      summaryAnalytics: {
        totalEvents,
        totalConfirmedBookings,
        totalWaitlistedBookings,
        totalCanceledBookings,
      },
      recentActivity,
    }

    return new Response(JSON.stringify(payloadResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Failed to fetch dashboard data', err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
