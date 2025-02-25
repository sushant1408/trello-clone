import { AuditLog } from "@prisma/client";
import { format } from "date-fns";

import { generateLogMessage } from "@/lib/generate-log-message";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ActivityItemProps {
  log: AuditLog;
}

const ActivityItem = ({ log }: ActivityItemProps) => {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="size-8">
        <AvatarImage src={log.userImage} />
        <AvatarFallback>
          {(log.userName || "User").charAt(0).toLowerCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-700">
            {log.userName || "User"}
          </span>{" "}
          {generateLogMessage(log)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};

export { ActivityItem };
