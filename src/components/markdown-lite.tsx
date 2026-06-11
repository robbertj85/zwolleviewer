"use client";

import React from "react";

/**
 * Tiny markdown renderer — just enough for LLM chat replies (headings,
 * bullet / numbered lists, **bold**, *italic*, `code`, [links](url)).
 * Deliberately not a full CommonMark parser; no raw HTML is ever rendered.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Order matters: links first, then code, then bold, then italic.
  const regex =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${i++}`;
    if (m[1]) {
      nodes.push(
        <a key={key} href={m[2]} className="text-primary underline underline-offset-2" target={m[2].startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {m[1]}
        </a>
      );
    } else if (m[3]) {
      nodes.push(
        <code key={key} className="rounded bg-foreground/10 px-1 py-0.5 text-[0.85em] font-mono">
          {m[3]}
        </code>
      );
    } else if (m[4]) {
      nodes.push(<strong key={key}>{m[4]}</strong>);
    } else if (m[5]) {
      nodes.push(<em key={key}>{m[5]}</em>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function MarkdownLite({ text, className }: { text: string; className?: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push(
        <p key={`p-${blocks.length}`} className="whitespace-pre-wrap">
          {renderInline(para.join("\n"), `p${blocks.length}`)}
        </p>
      );
      para = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trimEnd();

    if (trimmed.trim() === "") {
      flushPara();
      i++;
      continue;
    }

    // Headings
    const h = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (h) {
      flushPara();
      const level = h[1].length;
      const sizes = ["text-base font-semibold", "text-base font-semibold", "text-sm font-semibold", "text-sm font-semibold"];
      blocks.push(
        <p key={`h-${blocks.length}`} className={sizes[level - 1]}>
          {renderInline(h[2], `h${blocks.length}`)}
        </p>
      );
      i++;
      continue;
    }

    // Bullet list
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc space-y-0.5 pl-5">
          {items.map((it, j) => (
            <li key={j}>{renderInline(it, `ul${blocks.length}-${j}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol-${blocks.length}`} className="list-decimal space-y-0.5 pl-5">
          {items.map((it, j) => (
            <li key={j}>{renderInline(it, `ol${blocks.length}-${j}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    para.push(line);
    i++;
  }
  flushPara();

  return <div className={className ? `space-y-2 ${className}` : "space-y-2"}>{blocks}</div>;
}
