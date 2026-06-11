"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Map, Database, Network, BookOpen, ChevronDown, Building2, ListChecks, Plug, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_CITIES, getCity } from "@/lib/cities";

const NAV_LINKS = [
  { href: "/api-gateway", label: "API Gateway", icon: Database },
  { href: "/dataspace", label: "Dataspace", icon: Network },
  { href: "/pdc", label: "PDC", icon: PackageSearch },
  { href: "/assistent", label: "Connectiviteit", icon: Plug },
  { href: "/handleiding", label: "Handleiding", icon: BookOpen },
] as const;

function useActiveCity() {
  const pathname = usePathname();
  const slug = pathname.split("/")[1] ?? "";
  return getCity(slug);
}

function CitySwitcher() {
  const active = useActiveCity();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? ALL_CITIES.filter(
        (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q) || c.province.toLowerCase().includes(q)
      )
    : ALL_CITIES;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setQuery("");
          setOpen((o) => !o);
        }}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium hover:bg-accent transition-colors"
      >
        <Building2 className="h-3.5 w-3.5" />
        <span>{active?.name ?? "Kies stad"}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 rounded-md border bg-background shadow-xl z-50">
          <div className="border-b p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek gemeente…"
              className="w-full rounded-md border bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="max-h-80 overflow-y-auto">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 border-b px-3 py-2 text-xs hover:bg-accent transition-colors"
          >
            <Map className="h-3.5 w-3.5" />
            <span>Alle steden</span>
          </Link>
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground">Geen gemeente gevonden</div>
          )}
          {filtered.map((c) => {
            const isActive = c.slug === active?.slug;
            const live = c.status === "live";
            return live ? (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 text-xs transition-colors",
                  isActive
                    ? "bg-accent font-medium"
                    : "hover:bg-accent/50"
                )}
              >
                <span>{c.name}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">●</span>
              </Link>
            ) : (
              <div
                key={c.slug}
                className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground/50 cursor-not-allowed"
              >
                <span>{c.name}</span>
                <span className="text-[10px]">○</span>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const active = useActiveCity();
  const mapHref = active ? `/${active.slug}` : "/";

  return (
    <nav className="flex h-10 shrink-0 items-center border-b bg-background px-4 gap-4">
      <Link href="/" className="text-sm font-semibold tracking-tight">
        Basis Stadstwin
      </Link>

      <CitySwitcher />

      <div className="flex items-center gap-1">
        <Link
          href={mapHref}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            active && pathname === `/${active.slug}`
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          <Map className="h-3.5 w-3.5" />
          Kaart
        </Link>
        {active && active.status === "live" && (
          <Link
            href={`/${active.slug}/dekking`}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              pathname === `/${active.slug}/dekking`
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <ListChecks className="h-3.5 w-3.5" />
            Dekking
          </Link>
        )}
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
      <div className="ml-auto">
        <img
          src="/dmi-ecosysteem-logo.png"
          alt="DMI Ecosysteem"
          className="h-4"
        />
      </div>
    </nav>
  );
}
