"use client";

import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Sidebar } from "./sidebar";

const MobileSidebar = () => {
  const pathname = usePathname();
  const { isOpen, onClose, onOpen } = useMobileSidebar();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [onClose, pathname]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="ghost"
        size="sm"
        className="block md:hidden mr-2"
      >
        <MenuIcon className="!size-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <SheetTitle className="hidden"></SheetTitle>
          <Sidebar storageKey="sg-tc-mobile-sidebar-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export { MobileSidebar };
