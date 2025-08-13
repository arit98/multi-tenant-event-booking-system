import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
    slug: 'bookings',
    admin: {
        useAsTitle: 'id',
    },
    access: {
        read: () => true,
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
    timestamps: true,
}