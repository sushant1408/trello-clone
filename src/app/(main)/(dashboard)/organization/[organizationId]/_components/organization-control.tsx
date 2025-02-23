"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const OrgnizationControl = () => {
  const params = useParams<{ organizationId: string | undefined }>();

  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) {
      return;
    }

    setActive({ organization: params.organizationId });
  }, [setActive, params.organizationId]);

  return null;
};

export { OrgnizationControl };
