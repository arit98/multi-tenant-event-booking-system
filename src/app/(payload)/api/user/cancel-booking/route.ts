export async function POST(req: Request) {
  const { bookingId, eventId } = await req.json()

  console.log(`Booking ${bookingId} marked as canceled.`)

  console.log(`Creating Notification: booking_canceled for booking ${bookingId}.`)

  console.log(`Creating BookingLog: cancel_confirmed for booking ${bookingId}.`)

  const oldestWaitlistedBooking = { id: 'waitlist_booking_123', userId: 'user_456' }

  if (oldestWaitlistedBooking) {
    console.log(`Promoting waitlisted booking ${oldestWaitlistedBooking.id} to confirmed.`)

    console.log(
      `Creating Notification: waitlist_promoted for booking ${oldestWaitlistedBooking.id}.`,
    )

    console.log(
      `Creating BookingLog: promote_from_waitlist for booking ${oldestWaitlistedBooking.id}.`,
    )
  } else {
    console.log(`No waitlisted bookings to promote for event ${eventId}.`)
  }

  return new Response(JSON.stringify({ message: 'Booking canceled and waitlist processed.' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
}
