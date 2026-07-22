// /app/api/send-booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { db } from "@/lib/db";
import { services as servicesTable } from "@/lib/schema";

const STATIC_SERVICE_MAP: Record<string, string> = {
  'bond-cleaning': 'Bond Cleaning',
  'carpet-and-rug': 'Carpet and Rug Cleaning',
  'upholstery-and-car-seats': 'Upholstery and Car Seat Cleaning',
  'mattress': 'Mattress Cleaning',
  'curtain': 'Curtain Cleaning',
  'car-detailing': 'Car Detailing',
  'lawn-mowing': 'Lawn Mowing',
  'flood-damage': 'Flood Damage Restoration',
};

async function resolveServiceNames(serviceIdentifiers: any): Promise<string[]> {
  if (!serviceIdentifiers) return [];
  const list = Array.isArray(serviceIdentifiers) ? serviceIdentifiers : [serviceIdentifiers];

  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(STATIC_SERVICE_MAP)) {
    map.set(key.toLowerCase(), value);
  }

  try {
    const dbServices = await db
      .select({ id: servicesTable.id, name: servicesTable.name, slug: servicesTable.slug })
      .from(servicesTable);

    for (const srv of dbServices) {
      if (srv.id) map.set(srv.id.toLowerCase(), srv.name);
      if (srv.slug) map.set(srv.slug.toLowerCase(), srv.name);
      if (srv.name) map.set(srv.name.toLowerCase(), srv.name);
    }
  } catch (err) {
    console.error('Error fetching services for name mapping:', err);
  }

  return list.map((item) => {
    if (!item || typeof item !== 'string') return String(item || '');
    return map.get(item.toLowerCase()) || item;
  });
}

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
    const clean_created_at = new Date(booking.created_at || Date.now()).toLocaleString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const resolvedServices = await resolveServiceNames(booking.services);

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
Services: ${resolvedServices.join(", ")}
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

