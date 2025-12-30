// app/lib/stripe.ts
import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

export function getStripe() {
  if (stripeSingleton) return stripeSingleton;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY in env");

  stripeSingleton = new Stripe(secretKey);
  return stripeSingleton;
}
