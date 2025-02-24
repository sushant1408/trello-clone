"use client";

import { List } from "@prisma/client";
import { ComponentRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
  data: List;
}

const ListHeader = ({ data }: ListHeaderProps) => {
  const formRef = useRef<ComponentRef<"form">>(null);
  const inputRef = useRef<ComponentRef<"input">>(null);

  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess: ({ title }) => {
      setTitle(title);
      toast.success(`Renamed to "${title}"`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) {
      disableEditing();
      return;
    }

    execute({ title, id, boardId });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener("keydown", onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className="flex-1 px-[2px]">
          <input
            hidden
            value={data.boardId}
            name="boardId"
            id="boardId"
            onChange={() => {}}
          />
          <input hidden value={data.id} name="id" id="id" onChange={() => {}} />
          <FormInput
            ref={inputRef}
            id="title"
            onBlur={onBlur}
            placeholder="Enter list title..."
            defaultValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
            errors={fieldErrors}
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}

      <ListOptions data={data} onAddCard={() => {}} />
    </div>
  );
};

export { ListHeader };
