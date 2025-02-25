import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const retrievedSubscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Invalid session", { status: 400 });
    }

    await db.organizationSubscription.create({
      data: {
        orgId: session?.metadata?.orgId,
        stripeSubscriptionId: retrievedSubscription.id,
        stripeCustomerId: retrievedSubscription.customer as string,
        stripePriceId: retrievedSubscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          retrievedSubscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const retrievedSubscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Invalid session", { status: 400 });
    }

    await db.organizationSubscription.update({
      where: {
        stripeSubscriptionId: retrievedSubscription.id,
      },
      data: {
        stripePriceId: retrievedSubscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          retrievedSubscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
