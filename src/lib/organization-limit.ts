import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

const increaseAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const organizationLimit = await db.organizationLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (organizationLimit) {
    await db.organizationLimit.update({
      where: {
        orgId,
      },
      data: {
        count: organizationLimit.count + 1,
      },
    });
  } else {
    await db.organizationLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

const decreaseAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const organizationLimit = await db.organizationLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (organizationLimit) {
    await db.organizationLimit.update({
      where: {
        orgId,
      },
      data: {
        count: organizationLimit.count > 0 ? organizationLimit.count - 1 : 0,
      },
    });
  } else {
    await db.organizationLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

const hasAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const organizationLimit = await db.organizationLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (!organizationLimit || organizationLimit.count < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

const getAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return 0;
  }

  const organizationLimit = await db.organizationLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (!organizationLimit) {
    return 0;
  }

  return organizationLimit.count;
};

export { increaseAvailableCount, decreaseAvailableCount, hasAvailableCount, getAvailableCount };
