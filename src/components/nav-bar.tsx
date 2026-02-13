"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Kaart", icon: Map },
  { href: "/api-gateway", label: "API Gateway", icon: Database },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-10 shrink-0 items-center border-b bg-background px-4 gap-6">
      <Link href="/" className="text-sm font-semibold tracking-tight">
        Zwolle Data Viewer
      </Link>
      <div className="flex items-center gap-1">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                active
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
    </nav>
  );
}
