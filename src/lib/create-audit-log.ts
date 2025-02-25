import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, AuditLog, ENTITY_TYPE } from "@prisma/client";

import { db } from "./db";

interface Props {
  entityId: AuditLog["entityId"];
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = await auth();
    const user = await currentUser();

    if (!orgId || !user) {
      throw new Error("User not found");
    }

    const { action, entityId, entityTitle, entityType } = props;

    await db.auditLog.create({
      data: {
        orgId,
        action,
        entityId,
        entityType,
        entityTitle,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + " " + user?.lastName,
      },
    });
  } catch (error) {}
};

export { createAuditLog };
