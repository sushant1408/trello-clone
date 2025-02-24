"use client";

import { List } from "@prisma/client";
import { PlusIcon, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { ComponentRef, forwardRef, KeyboardEventHandler, useRef } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { createCard } from "@/actions/create-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";

interface CardFormProps {
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
  listId: List["id"];
}

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ disableEditing, enableEditing, isEditing, listId }, ref) => {
    const params = useParams<{ boardId: string }>();

    const formRef = useRef<ComponentRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: ({ title }) => {
        toast.success(`Card "${title}" created`);
        formRef.current?.reset();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId;

      execute({ boardId, listId, title });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card..."
            errors={fieldErrors}
          />
          <input
            hidden
            id="listId"
            name="listId"
            value={listId}
            onChange={() => {}}
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <XIcon className="!size-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
        >
          <PlusIcon className="!size-4" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";

export { CardForm };
