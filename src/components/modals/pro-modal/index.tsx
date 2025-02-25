"use client";

import Image from "next/image";
import { toast } from "sonner";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";

const ProModal = () => {
  const { isOpen, onClose } = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.svg" alt="hero" className="object-cover" fill />
        </div>
        <div className="text-neutral-700 space-y-6 p-6 mx-auto">
          <h2 className="font-semibold text-xl">
            Upgrade to Trello Clone today
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the best of Trello Clone
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>And more...</li>
            </ul>
          </div>
          <Button
            className="w-full"
            variant="primary"
            onClick={onClick}
            disabled={isLoading}
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ProModal };
