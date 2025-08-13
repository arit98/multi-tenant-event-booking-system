# Multi-Tenant Event Booking Setup Guide

## Issues Fixed

### 1. Database Query Error
- Fixed missing `tenant_id` field in Users collection
- Updated field names to match database schema expectations
- Added proper relationship configurations

### 2. Collection Configuration Issues
- Removed invalid `upload: true` properties from non-media collections
- Added proper admin configurations with `useAsTitle`
- Added field descriptions for better admin experience
- Fixed field validation and requirements

### 3. Error Handling
- Added proper error boundaries for React components
- Implemented API route error handling
- Added global error handling in Payload config
- Created proper error logging

### 4. CSS Deprecation Warnings
- Replaced deprecated `-ms-high-contrast` with modern `forced-colors-mode`
- Added accessibility improvements
- Added reduced motion support

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file with:

```bash
NEXT_PUBLIC_DATABASE_URI=postgresql://username:password@localhost:5432/event_booking_db
NEXT_PUBLIC_PAYLOAD_SECRET=your-super-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Database Setup
Ensure your PostgreSQL database is running and accessible.

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Generate Types
```bash
pnpm run generate:types
```

### 5. Run Database Migration
```bash
node src/scripts/fix-database.js
```

### 6. Start Development Server
```bash
pnpm run dev
```

## Collection Structure

### Users
- `name`: User's full name
- `email`: Unique email address
- `role`: attendee, organizer, or admin
- `tenant_id`: Relationship to tenant
- `isActive`: Account status

### Tenants
- `name`: Tenant name
- `domain`: Associated domain
- `isActive`: Tenant status

### Events
- `title`: Event title
- `description`: Rich text description
- `date`: Event date
- `capacity`: Maximum attendees
- `organizer`: Relationship to user
- `tenant`: Relationship to tenant
- `isActive`: Event status

### Bookings
- `event`: Relationship to event
- `user`: Relationship to user
- `status`: confirmed, waitlisted, or canceled
- `tenant`: Relationship to tenant
- `bookingDate`: When booking was made

### Media
- `alt`: Alt text for accessibility
- `tenant`: Optional tenant relationship
- Proper image sizing and optimization

## Access Control

All collections currently have `read: () => true` for development. In production, implement proper access control based on user roles and tenant membership.

## Error Handling

The application now includes:
- Global error boundaries
- API route error handling
- Proper error logging
- User-friendly error messages

## Accessibility

- Modern forced-colors-mode support
- Focus management
- Reduced motion support
- Skip links
- Proper ARIA labels

## Next Steps

1. Test the admin panel at `/admin`
2. Create test data for all collections
3. Implement proper access control
4. Add email notifications
5. Set up file storage
6. Add testing coverage
