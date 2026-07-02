"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CheckoutButtonProps {
  amount: number;
  planName: string;
  variant?: "default" | "outline" | "gradient";
}

export function CheckoutButton({ planName, variant = "default" }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handlePayment = async () => {
    if (!session?.user) {
      router.push("/login?callbackUrl=/premium");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order
      const res = await fetch("/api/premium/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: planName }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const order = await res.json();

      // 2. Load Razorpay script if not already loaded
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC_ for client
        amount: order.amount,
        currency: order.currency,
        name: "ExamSetu",
        description: `${planName} Subscription`,
        order_id: order.id,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handler: function (_response: unknown) {
          // You could optionally verify the signature on the client,
          // or just rely on the webhook. Webhook is safer.
          // For UX, just redirect to dashboard/settings or show success.
          router.push("/dashboard?upgrade=success");
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        theme: {
          color: "#3b82f6", // tailwind blue-500
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className="mt-6 w-full"
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Choose ${planName}`
      )}
    </Button>
  );
}
