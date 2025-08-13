// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
import { Events } from './collections/Events'
import { Bookings } from './collections/Bookings'
import { BookingLogs } from './collections/BookingLogs'
import { Notifications } from './collections/Notifications'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Event Booking Admin',
      ogImage: '/og-image.jpg',
      favicon: '/favicon.ico',
    },
  },
  collections: [Users, Media, Tenants, Events, Bookings, BookingLogs, Notifications],
  editor: lexicalEditor(),
  secret: process.env.NEXT_PUBLIC_PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.NEXT_PUBLIC_DATABASE_URI || '',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  // Add session configuration
  express: {
    json: {
      limit: '10mb',
    },
  },
})
