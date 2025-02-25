"use client";

import { toast } from "sonner";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";

interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const { onOpen } = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      onOpen();
    }
  };

  return (
    <Button variant="primary" onClick={onClick} disabled={isLoading}>
      {isPro ? "Manage subscription" : "Upgrade to pro"}
    </Button>
  );
};

export { SubscriptionButton };
