"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Server, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/assistent", label: "AI inference — bring your own AI", icon: Bot },
  { href: "/assistent/mcp", label: "MCP-server", icon: Server },
] as const;

export default function AssistentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center gap-1 px-4 pt-3">
          <span className="mr-3 flex items-center gap-1.5 text-sm font-semibold">
            <Plug className="h-4 w-4" /> Connectiviteit
          </span>
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-t-md border border-b-0 px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-border bg-background text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
