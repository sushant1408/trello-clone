import { ReactNode } from "react";
import { OrgnizationControl } from "./_components/organization-control";

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
