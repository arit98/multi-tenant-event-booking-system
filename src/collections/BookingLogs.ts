import type { CollectionConfig } from 'payload'

export const BookingLogs: CollectionConfig = {
  slug: 'bookingLogs',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false
      // Attendees should only see logs related to their bookings
      if (user.role === 'attendee') return { user: { equals: user.id } } as any
      // Organizers and admins can see logs for their tenant
      const tenantId =
        typeof user.tenant_id === 'string' || typeof user.tenant_id === 'number'
          ? user.tenant_id
          : user.tenant_id?.id
      if (user.role === 'organizer' || user.role === 'admin')
        return { tenant: { equals: tenantId } } as any
      return false
    },
  },
  fields: [
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      admin: {
        description: 'The booking this log entry refers to',
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      admin: {
        description: 'The event related to this log entry',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user this log entry is about',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Create Request', value: 'create_request' },
        { label: 'Auto Waitlisted', value: 'auto_waitlisted' },
        { label: 'Auto Confirm', value: 'auto_confirm' },
        { label: 'Cancel Confirmed', value: 'cancel_confirmed' },
      ],
      admin: {
        description: 'The type of log entry',
      },
    },
    {
      name: 'note',
      type: 'text',
      required: true,
      admin: {
        description: 'Additional notes about this log entry',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this log entry belongs to',
      },
    },
  ],
  timestamps: true,
}
