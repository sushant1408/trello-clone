import { currentUser } from "@clerk/nextjs/server";
import { ReactNode } from "react";

import { redirect } from "next/navigation";
import { Navbar } from "./_components/navbar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }
  
  return (
    <div className="h-full">
      <Navbar />
      {children}
    </div>
  );
}
