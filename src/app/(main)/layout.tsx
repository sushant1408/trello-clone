import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Toaster } from "sonner";

import { Modals } from "@/components/modals";
import { QueryProvider } from "@/components/query-provider";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <QueryProvider>
        <Toaster />
        <Modals />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
}
