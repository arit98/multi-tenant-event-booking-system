import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false
      if (user.role === 'attendee') return { user: { equals: user.id } } as any
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user receiving this notification',
      },
    },
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      admin: {
        description: 'The booking this notification is about',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Booking Confirmed', value: 'booking_confirmed' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Waitlist Promoted', value: 'waitlist_promoted' },
        { label: 'Booking Canceled', value: 'booking_canceled' },
      ],
      admin: {
        description: 'The type of notification',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'richText',
      required: true,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this notification has been read',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this notification belongs to',
      },
    },
  ],
  timestamps: true,
}
