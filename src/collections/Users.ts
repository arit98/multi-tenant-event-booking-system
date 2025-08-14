import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'password',
      type: 'password' as unknown as any,
      required: true,
      admin: {
        description: 'User password (hashed automatically by Payload)',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Attendee', value: 'attendee' },
        { label: 'Organizer', value: 'organizer' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'attendee',
      required: true,
    },
    {
      name: 'tenant_id',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      admin: {
        description: 'The tenant this user belongs to',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this user account is active',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Ensure email is lowercase
        if (data.email) {
          data.email = data.email.toLowerCase()
        }
        return data
      },
    ],
  },
}
