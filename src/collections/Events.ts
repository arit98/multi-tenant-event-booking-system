import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: any) => {
      if (!user) return false
      // Only organizers and admins can create events for their tenant
      return user.role === 'organizer' || user.role === 'admin'
    },
    update: ({ req: { user }, doc }: any) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'organizer') {
        const tenantId =
          typeof user.tenant_id === 'string' || typeof user.tenant_id === 'number'
            ? user.tenant_id
            : user.tenant_id?.id
        return doc?.tenant === tenantId || doc?.tenant?.id === tenantId
      }
      return false
    },
    delete: ({ req: { user }, doc }: any) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'organizer') {
        const tenantId =
          typeof user.tenant_id === 'string' || typeof user.tenant_id === 'number'
            ? user.tenant_id
            : user.tenant_id?.id
        return doc?.tenant === tenantId || doc?.tenant?.id === tenantId
      }
      return false
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user organizing this event',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this event belongs to',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this event is active',
      },
    },
  ],
  timestamps: true,
}
