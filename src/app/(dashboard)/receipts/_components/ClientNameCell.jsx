"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { extractClientNameAI } from "@/app/actions/receipts/extract-client-name";

export default function ClientNameCell({ rawText }) {
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null); // 'regex' | 'ai' | 'fallback'

  useEffect(() => {
    if (!rawText) {
      setName("N/A");
      setLoading(false);
      return;
    }

    // 1. Regex Strategy
    // Keywords: Mr., Md., Mrs., Mst., M/S, Prop., A/c
    const regex = /(?:Mr\.|Md\.|Mrs\.|Mst\.|M\/S|Prop\.|A\/c)\s+([^\n]+)/i;
    const match = rawText.match(regex);

    if (match && match[1]) {
      setName(match[1].trim());
      setSource("regex");
      setLoading(false);
    } else {
      // 2. AI Strategy (If Regex Fails)
      // Call server action
      const fetchWithAI = async () => {
        const result = await extractClientNameAI(rawText);
        if (result.success && result.name) {
          setName(result.name);
          setSource("ai");
        } else {
          // 3. Fallback: First line truncated
          const firstLine = rawText.split("\n")[0].substring(0, 30);
          setName(firstLine + "...");
          setSource("fallback");
        }
        setLoading(false);
      };

      fetchWithAI();
    }
  }, [rawText]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Loader2 className="size-3 animate-spin" />
        <span>Extracting...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{name}</span>
      {source === "ai" && (
        <Sparkles className="size-3 text-indigo-500" title="Extracted by AI" />
      )}
    </div>
  );
}
