import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
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