"use client";

import { List } from "@prisma/client";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { ComponentRef, useRef } from "react";
import { toast } from "sonner";

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ComponentRef<"button">>(null);

  const { execute: executeCopyList } = useAction(copyList, {
    onSuccess: ({ title }) => {
      toast.success(`List "${title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeDeleteList } = useAction(deleteList, {
    onSuccess: ({ title }) => {
      toast.success(`List "${title}" delete`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeCopyList({ boardId, id });
  };

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeDeleteList({ boardId, id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontalIcon className="!size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List options
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
            size="icon"
          >
            <XIcon className="!size-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" value={data.id} onChange={() => {}} />
          <input
            hidden
            name="boardId"
            id="boardId"
            value={data.boardId}
            onChange={() => {}}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list...
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" value={data.id} onChange={() => {}} />
          <input
            hidden
            name="boardId"
            id="boardId"
            value={data.boardId}
            onChange={() => {}}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm hover:text-rose-600"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export { ListOptions };
