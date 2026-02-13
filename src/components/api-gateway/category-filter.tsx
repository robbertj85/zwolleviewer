"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryInfo {
  id: string;
  label: string;
  layerCount: number;
}

interface CategoryFilterProps {
  categories: CategoryInfo[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selected === null ? "default" : "outline"}
        className="cursor-pointer select-none"
        onClick={() => onSelect(null)}
      >
        Alles
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat.id}
          variant={selected === cat.id ? "default" : "outline"}
          className="cursor-pointer select-none"
          onClick={() => onSelect(selected === cat.id ? null : cat.id)}
        >
          {cat.label}
          <span className="ml-1 opacity-60">{cat.layerCount}</span>
        </Badge>
      ))}
    </div>
  );
}
