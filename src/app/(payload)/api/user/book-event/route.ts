export async function POST(req: Request) {
  const { eventId, userId } = await req.json()

  const confirmedCount = 0 
  const capacity = 10 

  let status
  let notificationType
  let bookingLogType

  if (confirmedCount < capacity) {
    status = 'confirmed'
    notificationType = 'booking_confirmed'
    bookingLogType = 'auto_confirm'
  } else {
    status = 'waitlisted'
    notificationType = 'waitlisted'
    bookingLogType = 'auto_waitlist'
  }

  console.log(`Booking for event ${eventId} by user ${userId} is ${status}.`)
  console.log(`Creating Notification: ${notificationType}`)
  console.log(`Creating BookingLog: ${bookingLogType}`)

  return new Response(JSON.stringify({ status }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
}
