"use client";

import FederalTemplate from "./templates/FederalTemplate";
import GlobalTemplate from "./templates/GlobalTemplate";

export default function ReceiptRenderer({ data, code }) {
  // Route to appropriate template based on company type
  const TemplateComponent =
    data.companyType === "FEDERAL" ? FederalTemplate : GlobalTemplate;

  return <TemplateComponent data={data} code={code} />;
}
