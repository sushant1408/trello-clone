import { HelpCircleIcon, User2Icon } from "lucide-react";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { FormPopover } from "@/components/form/form-popover";

const BoardList = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2Icon className="!size-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <FormPopover sideOffset={10} side="right">
          <button className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
            <p className="text-sm">Create new board</p>
            <span className="text-xs">5 remaining</span>
            <TooltipWrapper
              sideOffset={10}
              label={`
              Free workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
            `}
            >
              <HelpCircleIcon className="absolute bottom-2 right-2 !size-[14px]" />
            </TooltipWrapper>
          </button>
        </FormPopover>
      </div>
    </div>
  );
};

export { BoardList };
