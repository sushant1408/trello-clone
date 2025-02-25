"use client";

import { CopyIcon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";

interface CardActionsProps {
  data: CardWithList;
}

const CardActions = ({ data }: CardActionsProps) => {
  const params = useParams<{ boardId: string }>();

  const { onClose } = useCardModal();

  const { execute: executeCopyCard, isLoading: isCopying } = useAction(
    copyCard,
    {
      onSuccess: ({ title }) => {
        toast.success(`Card "${title}" copied`);
        onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );
  const { execute: executeDeleteCard, isLoading: isDeleting } = useAction(
    deleteCard,
    {
      onSuccess: ({ title }) => {
        toast.success(`Card "${title}" deleted`);
        onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    executeCopyCard({ boardId: params.boardId, id: data.id });
  };

  const onDelete = () => {
    executeDeleteCard({ boardId: params.boardId, id: data.id });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={isCopying}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <CopyIcon className="!size-4" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isDeleting}
        variant="gray"
        className="w-full justify-start hover:text-rose-600"
        size="inline"
      >
        <TrashIcon className="!size-4" />
        Delete
      </Button>
    </div>
  );
};

CardActions.Skeleton = function CardActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};

export { CardActions };
