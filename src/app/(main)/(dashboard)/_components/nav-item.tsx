"use client";

import {
  ActivityIcon,
  CreditCardIcon,
  LayoutIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

interface NavItemProps {
  isActive: boolean;
  isExpanded: boolean;
  organization: Organization;
  onExpand: (id: Organization["id"]) => void;
}

const NavItem = ({
  isActive,
  isExpanded,
  onExpand,
  organization,
}: NavItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: "Boards",
      icon: <LayoutIcon className="!size-4" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Activity",
      icon: <ActivityIcon className="!size-4" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="!size-4" />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: "Billing",
      icon: <CreditCardIcon className="!size-4" />,
      href: `/organization/${organization.id}/billing`,
    },
  ];

  const onClick = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="size-7 relative">
            <Image
              src={organization.imageUrl}
              fill
              alt="organization"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map((route) => (
          <Button
            key={route.href}
            size="sm"
            onClick={() => onClick(route.href)}
            variant="ghost"
            className={cn("w-full font-normal justify-start pl-10 mb-1", pathname === route.href && "bg-sky-500/10 text-sky-700")}
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export { NavItem };
