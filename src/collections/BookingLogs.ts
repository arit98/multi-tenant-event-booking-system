import type { CollectionConfig } from 'payload'

export const BookingLogs: CollectionConfig = {
    slug: 'bookingLogs',
    admin: {
        useAsTitle: 'id',
    },
    access: {
        read: () => true,
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
        }
    ],
    timestamps: true,
}