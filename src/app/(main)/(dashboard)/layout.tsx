import { ReactNode } from "react";

import { Navbar } from "./_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { orgId } = await auth();

  if (!orgId) {
    redirect("/select-org");
  }

  return (
    <div className="h-full">
      <Navbar />
      {children}
    </div>
  );
}
