"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EndpointDisplayProps {
  method?: string;
  path: string;
}

export default function EndpointDisplay({ method = "GET", path }: EndpointDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 font-mono text-xs">
      <span className="font-semibold text-emerald-400">{method}</span>
      <span className="truncate text-muted-foreground">{path}</span>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto h-6 w-6 shrink-0"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-emerald-400" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
