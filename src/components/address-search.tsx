"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";

interface Suggestion {
  weergavenaam: string;
  type: string;
  centroide_ll?: string;
  id: string;
}

interface AddressSearchProps {
  onSelect: (lng: number, lat: number) => void;
  onClear?: () => void;
}

function parseWKTPoint(wkt: string | undefined): [number, number] | null {
  if (!wkt) return null;
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2])];
}

export default function AddressSearch({ onSelect, onClear }: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback((q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (q.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(
          `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=${encodeURIComponent(q)}&rows=7`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        const docs: Suggestion[] = (data.response?.docs ?? []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d: any) => ({
            weergavenaam: d.weergavenaam,
            type: d.type,
            centroide_ll: d.centroide_ll,
            id: d.id,
          })
        );
        setSuggestions(docs);
        setOpen(docs.length > 0);
        setActiveIndex(-1);
      } catch {
        // aborted or network error — ignore
      }
    }, 300);
  }, []);

  const handleSelect = useCallback(
    async (suggestion: Suggestion) => {
      setQuery(suggestion.weergavenaam);
      setOpen(false);
      setSuggestions([]);

      // Try parsing coordinates from the suggestion itself
      let coords = parseWKTPoint(suggestion.centroide_ll);

      // Fall back to the lookup endpoint when centroide_ll is missing
      if (!coords) {
        try {
          const res = await fetch(
            `https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?id=${encodeURIComponent(suggestion.id)}`
          );
          if (res.ok) {
            const data = await res.json();
            coords = parseWKTPoint(data.response?.docs?.[0]?.centroide_ll);
          }
        } catch {
          // network error — ignore
        }
      }

      if (coords) onSelect(coords[0], coords[1]);
    },
    [onSelect]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    onClear?.();
    inputRef.current?.focus();
  }, [onClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
        return;
      }
      if (!open || suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    },
    [open, suggestions, activeIndex, handleSelect]
  );

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-[min(calc(100vw-7rem),400px)]">
      <div className="flex items-center gap-1.5 rounded-md bg-background/90 px-3 py-1.5 shadow-md backdrop-blur-sm">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Zoek adres of locatie..."
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={handleClear}
            className="shrink-0 rounded-sm p-0.5 hover:bg-accent"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md bg-background/95 shadow-xl backdrop-blur-md border">
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                i === activeIndex ? "bg-accent" : "hover:bg-accent/50"
              }`}
            >
              <span className="flex-1 truncate">{s.weergavenaam}</span>
              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {s.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
