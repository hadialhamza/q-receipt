"use client";

import { FilePlus } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";

export default function CreateHeader() {
  return (
    <PageHeader
      title="Create"
      highlightWord="Receipt"
      description="Generate a new insurance receipt manually or auto-fill using AI."
      icon={FilePlus}
    />
  );
}
