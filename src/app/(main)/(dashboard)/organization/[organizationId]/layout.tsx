import { startCase } from "lodash";
import { ReactNode } from "react";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

import { OrgnizationControl } from "./_components/organization-control";

export async function generateMetadata(): Promise<Metadata> {
  const { orgSlug } = await auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

export default function OrganizationIdLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <OrgnizationControl />
      {children}
    </>
  );
}
