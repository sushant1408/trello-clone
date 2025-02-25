"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Organization } from "@/types";
import { NavItem } from "./nav-item";

interface SidebarProps {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "sg-tc-sidebar-state" }: SidebarProps) => {
  /**
   * expanded is going to look like this:
   * {
   *    ":organizationId-1": true,
   *    ":organizationId-2": true,
   *    ":organizationId-3": false,
   * }
   */
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const { isLoaded: isOrganizationLoaded, organization: activeOrganization } =
    useOrganization();
  const { isLoaded: isOrganizationListLoaded, userMemberships } =
    useOrganizationList({
      userMemberships: {
        infinite: true,
      },
    });

  /**
   * this reduce will turn "expanded" into an array of organizationIds
   * whose value is true. e.g. [":organizationId-1", ":organizationId-2"]
   */
  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    },
    []
  );

  const onExpand = (organizationId: string) => {
    setExpanded((prevState) => ({
      ...prevState,
      [organizationId]: !expanded[organizationId],
    }));
  };

  if (
    !isOrganizationLoaded ||
    !isOrganizationListLoaded ||
    userMemberships.isLoading
  ) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto"
        >
          <Link href={`/select-org`}>
            <PlusIcon className="!size-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  );
};

export { Sidebar };
