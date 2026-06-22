// /app/api/send-booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getExpectedTwilioSignature } from "twilio/lib/webhooks/webhooks";

// Initialize Twilio client
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const whatsappFrom = "whatsapp:+18566996136"; // Your Twilio WhatsApp number

// List of recipients
// const recipients = ["+9779800934398", "+9779842944594", "+61422208293", "+61466988593"];
const recipients = ["+9779800934398"];

export async function POST(req: NextRequest) {
  const xTwilioSignature = getExpectedTwilioSignature(
    authToken!,
    "https://notify-booking-4603.twil.io/sender1?Body=hellothere",
    {} // <- Leave this empty
  );

  // Print the signature to the console for use with your
  // preferred HTTP client
  console.log("xTwilioSignature: ", xTwilioSignature);
  //   return NextResponse.json({ message: "Booking received, WhatsApp sending in progress" }, { status: 200 });
  // } catch (error) {
  //   console.error("Twilio Error:", error);
  //   return NextResponse.json({ message: "Error sending booking", error }, { status: 500 });
  // }
}
