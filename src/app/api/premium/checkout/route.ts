import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payment gateway is not configured." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    let amount = 0;
    if (planId === "Monthly") amount = 99;
    else if (planId === "Quarterly") amount = 249;
    else if (planId === "Yearly") amount = 799;
    else if (planId === "Lifetime") amount = 1999;
    else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `rcpt_${session.user.id.substring(0, 10)}_${Date.now().toString().slice(-8)}`,
      notes: {
        userId: session.user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
