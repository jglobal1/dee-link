import { useState } from "react";
import { Check, Copy, Trash2, Eye } from "lucide-react";
import type { SnipLink } from "@/lib/shortener";

interface LinkCardProps {
  link: SnipLink;
  baseUrl: string;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, baseUrl, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${baseUrl}/s/${link.shortCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeAgo = getTimeAgo(link.createdAt);
  const preview =
    link.message.length > 80
      ? link.message.slice(0, 80) + "…"
      : link.message;

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/50">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-sm text-foreground leading-relaxed">{preview}</p>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleCopy}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Preview link"
          >
            <Eye className="h-4 w-4" />
          </a>
          <button
            onClick={() => onDelete(link.id)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
            aria-label="Delete link"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleCopy}
          className="truncate text-xs font-medium text-foreground hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          {shortUrl}
        </button>
        <span className="shrink-0 text-xs text-muted-foreground">
          {timeAgo} · {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
        </span>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
