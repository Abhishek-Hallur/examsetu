import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Premium",
  description:
    "Go ad-free with unlimited & offline downloads, advanced search and study analytics from ₹99/month.",
};

const FREE = [
  "Unlimited browsing",
  "Download free resources",
  "Bookmarks",
  "Full search",
  "Ad-supported",
];

const PREMIUM = [
  "No ads",
  "Unlimited downloads",
  "Offline downloads",
  "Priority downloads",
  "Advanced search",
  "Unlimited bookmarks",
  "Reading sync across devices",
  "Premium badge",
  "Study analytics",
  "Priority support",
  "Exclusive themes",
];

const PLANS = [
  { name: "Monthly", price: "₹99", per: "/month" },
  { name: "Quarterly", price: "₹249", per: "/3 months", tag: "Save 16%" },
  { name: "Yearly", price: "₹799", per: "/year", tag: "Most popular", featured: true },
  { name: "Lifetime", price: "₹1999", per: "one-time", tag: "Best value" },
];

export default function PremiumPage() {
  return (
    <div className="container py-14">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="premium">
          <Sparkles className="mr-1 size-3" /> Premium
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Study without limits
        </h1>
        <p className="mt-3 text-muted-foreground">
          Everything in Free, plus the tools serious aspirants need. Cancel
          anytime. Payments (Razorpay / UPI) go live in Phase 8.
        </p>
      </div>

      {/* Plans */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "relative flex flex-col p-6",
              p.featured && "border-primary shadow-lg shadow-primary/10"
            )}
          >
            {p.tag && (
              <Badge
                variant={p.featured ? "premium" : "secondary"}
                className="absolute -top-2.5 left-1/2 -translate-x-1/2"
              >
                {p.tag}
              </Badge>
            )}
            <h3 className="font-semibold">{p.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">{p.price}</span>
              <span className="text-sm text-muted-foreground"> {p.per}</span>
            </div>
            <Button
              variant={p.featured ? "gradient" : "outline"}
              className="mt-6 w-full"
              asChild
            >
              <Link href="/signup">Choose {p.name}</Link>
            </Button>
          </Card>
        ))}
      </div>

      {/* Comparison */}
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-bold">Free</h3>
          <p className="text-sm text-muted-foreground">₹0 forever</p>
          <ul className="mt-4 space-y-2">
            {FREE.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="border-primary/40 bg-primary/[0.03] p-6">
          <h3 className="text-lg font-bold text-gradient">Premium</h3>
          <p className="text-sm text-muted-foreground">from ₹99/month</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PREMIUM.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
