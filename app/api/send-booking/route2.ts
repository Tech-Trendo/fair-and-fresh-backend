// /app/api/send-booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const whatsappFrom = "whatsapp:+18566996136"; // Your Twilio WhatsApp number

// List of recipients
// const recipients = ["+9779800934398", "+9779842944594", "+61422208293", "+61466988593"];
const recipients = ["+9779800934398"];

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();

    // Format created_at date
    const clean_created_at = new Date(booking.created_at).toLocaleString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Fire-and-forget sending to all recipients
    // recipients.forEach(async (to) => {
    const to = recipients[0];
    try {
      const message = await client.messages.create({
        from: whatsappFrom,
        to: `whatsapp:${to}`,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
        body: `New Booking Received:
ID: ${booking.id}
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Services: ${booking.services.join(", ")}
City: ${booking.city}
Street: ${booking.street}
Preferred Date: ${booking.preferred_date}
Preferred Time: ${booking.preferred_time}
Status: ${booking.status}
Created At: ${clean_created_at}`,
      });

      console.log(`WhatsApp sent to ${to}: SID ${message.sid}`);
    } catch (err) {
      console.error(`Failed to send to ${to}:`, err);
    }
    // });

    // Immediately respond to the frontend
    return NextResponse.json({ message: "Booking received, WhatsApp sending in progress" }, { status: 200 });
  } catch (error) {
    console.error("Twilio Error:", error);
    return NextResponse.json({ message: "Error sending booking", error }, { status: 500 });
  }
}
