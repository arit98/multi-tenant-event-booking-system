import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'domain',
            type: 'text',
            admin: {
                description: 'The domain associated with this tenant',
            },
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
            admin: {
                description: 'Whether this tenant is active',
            },
        },
    ],
    timestamps: true,
}