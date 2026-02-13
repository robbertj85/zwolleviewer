"use client";

import { Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EndpointDisplay from "./endpoint-display";
import ResponsePreview from "./response-preview";

interface LayerCardProps {
  layer: {
    id: string;
    name: string;
    description: string;
    source: string;
    category: string;
    categoryLabel: string;
    apiEndpoint: string;
    downloadUrl: string;
  };
}

export default function LayerCard({ layer }: LayerCardProps) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="gap-1 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{layer.name}</CardTitle>
          <Badge variant="secondary" className="text-[10px] shrink-0">
            {layer.categoryLabel}
          </Badge>
        </div>
        <CardDescription className="text-xs line-clamp-2">
          {layer.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 space-y-2">
        <EndpointDisplay path={layer.apiEndpoint} />
        <p className="text-[10px] text-muted-foreground">
          Bron: {layer.source}
        </p>
      </CardContent>

      <CardFooter className="px-4 gap-2">
        <ResponsePreview apiEndpoint={layer.apiEndpoint} layerName={layer.name} />
        <a href={layer.downloadUrl}>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            <Download className="h-3 w-3" />
            Download
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
