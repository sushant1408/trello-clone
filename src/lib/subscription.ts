import { auth } from "@clerk/nextjs/server";

import { db } from "./db";

const DAY_IN_MS = 84_40_000; // 1 day

const checkSubscription = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return false;
  }

  const organizationSubscription = await db.organizationSubscription.findUnique(
    {
      where: {
        orgId,
      },
      select: {
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
        stripeSubscriptionId: true,
      },
    }
  );

  if (!organizationSubscription) {
    return false;
  }

  const isValid =
    organizationSubscription.stripePriceId &&
    organizationSubscription.stripeCurrentPeriodEnd &&
    organizationSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS >
      Date.now();

  return !!isValid;
};

export { checkSubscription };
