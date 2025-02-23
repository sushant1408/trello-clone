import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
