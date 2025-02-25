"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { StripeRedirectSchema } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthorized",
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);

  let url = "";

  try {
    const organizationSubscription =
      await db.organizationSubscription.findUnique({
        where: {
          orgId,
        },
      });

    if (organizationSubscription && organizationSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: organizationSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      if (!stripeSession.url) {
        return {
          error: "Failed to create a session",
        };
      }

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card", "paypal"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress || "",
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Trello Clone",
                description: "Unlimited boards for your organization",
              },
              unit_amount: 2000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });

      if (!stripeSession.url) {
        return {
          error: "Failed to create a session",
        };
      }

      url = stripeSession.url;
    }
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  return {
    data: url,
  };
};

export const stripeRedirect = createSafeAction(StripeRedirectSchema, handler);
