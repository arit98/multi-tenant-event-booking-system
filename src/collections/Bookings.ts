import type { CollectionConfig } from 'payload'

const getTenantIdFromUser = (user: any) => {
  if (!user) return null
  if (typeof user.tenant_id === 'string' || typeof user.tenant_id === 'number')
    return user.tenant_id
  // Guard against null (typeof null === 'object') before using the 'in' operator
  if (user.tenant_id && typeof user.tenant_id === 'object' && 'id' in user.tenant_id)
    return (user.tenant_id as any).id
  return null
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    // Read: attendees can only see their own bookings; organizers/admins can see all bookings for their tenant
    read: ({ req: { user } }: any) => {
      if (!user) return false
      if (user.role === 'attendee') return { user: { equals: user.id } } as any
      const tenantId = getTenantIdFromUser(user)
      if (user.role === 'organizer' || user.role === 'admin')
        return { tenant: { equals: tenantId } } as any
      return false
    },
    // Create: attendees can only create bookings for themselves; organizer/admin can create bookings for their tenant
    create: ({ req: { user }, data }: any) => {
      if (!user) return false
      const tenantId = getTenantIdFromUser(user)
      if (user.role === 'attendee') {
        const bookingUser = typeof data?.user === 'string' ? data.user : data?.user?.id
        return bookingUser === user.id
      }
      if (user.role === 'organizer' || user.role === 'admin') {
        const bookingTenant = typeof data?.tenant === 'string' ? data.tenant : data?.tenant?.id
        return tenantId && bookingTenant === tenantId
      }
      return false
    },
    // Update: attendees can update their own bookings; organizer/admin can update bookings in their tenant
    update: ({ req: { user }, id, doc }: any) => {
      if (!user) return false
      if (user.role === 'attendee') return doc?.user === user.id || doc?.user?.id === user.id
      const tenantId = getTenantIdFromUser(user)
      if (user.role === 'organizer' || user.role === 'admin')
        return doc?.tenant === tenantId || doc?.tenant?.id === tenantId
      return false
    },
    // Delete: same rules as update
    delete: ({ req: { user }, id, doc }: any) => {
      if (!user) return false
      if (user.role === 'attendee') return doc?.user === user.id || doc?.user?.id === user.id
      const tenantId = getTenantIdFromUser(user)
      if (user.role === 'organizer' || user.role === 'admin')
        return doc?.tenant === tenantId || doc?.tenant?.id === tenantId
      return false
    },
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      admin: {
        description: 'The event being booked',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user making the booking',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Canceled', value: 'canceled' },
      ],
      defaultValue: 'waitlisted',
      required: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this booking belongs to',
      },
    },
    {
      name: 'bookingDate',
      type: 'date',
      admin: {
        description: 'When the booking was made',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, previousDoc }: { req: any; doc: any; previousDoc?: any }) => {
        try {
          // Determine if status changed (or if this is a new doc)
          const previousStatus = previousDoc ? previousDoc.status : null
          const newStatus = doc.status
          if (previousStatus === newStatus) return

          // Map booking status change to notification type
          let notificationType: string
          if (previousStatus === 'waitlisted' && newStatus === 'confirmed') {
            notificationType = 'waitlist_promoted'
          } else {
            const map: Record<string, string> = {
              confirmed: 'booking_confirmed',
              waitlisted: 'waitlisted',
              canceled: 'booking_canceled',
            }
            notificationType = map[newStatus] || 'booking_confirmed'
          }

          // Friendly title & message
          const titleMap: Record<string, string> = {
            booking_confirmed: 'Booking confirmed',
            waitlisted: 'Added to waitlist',
            waitlist_promoted: 'Promoted from waitlist',
            booking_canceled: 'Booking canceled',
          }

          const title = titleMap[notificationType] || 'Booking update'
          const messageText = (() => {
            switch (notificationType) {
              case 'booking_confirmed':
                return 'Your booking has been confirmed.'
              case 'waitlisted':
                return 'Your booking is on the waitlist.'
              case 'waitlist_promoted':
                return 'Your booking was promoted from the waitlist and is now confirmed.'
              case 'booking_canceled':
                return 'Your booking has been canceled.'
              default:
                return 'Your booking status has changed.'
            }
          })()

          const richTextMessage = {
            root: {
              type: 'root',
              children: [
                {
                  type: 'p',
                  children: [
                    {
                      text: messageText,
                    },
                  ],
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              version: 1,
            },
          }

          // Create notification
          await req.payload.create({
            collection: 'notifications',
            data: {
              user: doc.user,
              booking: doc.id,
              type: notificationType,
              title,
              message: richTextMessage,
              tenant: doc.tenant,
            },
            req,
          })
        } catch (err) {
          console.error('Failed to create booking status notification', err)
        }
      },
    ],
  },
  timestamps: true,
}
