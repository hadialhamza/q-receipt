"use client";

import FederalTemplate from "./templates/FederalTemplate";
import GlobalTemplate from "./templates/GlobalTemplate";
import TakafulTemplate from "./templates/TakafulTemplate";

export default function ReceiptRenderer({ data, code }) {
  // Route to appropriate template based on company type
  const templates = {
    FEDERAL: FederalTemplate,
    GLOBAL: GlobalTemplate,
    TAKAFUL: TakafulTemplate,
  };

  const TemplateComponent = templates[data.companyType] || GlobalTemplate;

  return <TemplateComponent data={data} code={code} />;
}
