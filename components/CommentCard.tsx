"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/types";

interface CommentCardProps {
  comment: Comment;
  isRegenerating: boolean;
  onRegenerate: () => void;
}

const LABEL_COLORS: Record<string, string> = {
  reply_magnet: "bg-blue-50 text-blue-700 border-blue-200",
  authority_builder: "bg-violet-50 text-violet-700 border-violet-200",
  discussion_starter: "bg-amber-50 text-amber-700 border-amber-200",
  contrarian: "bg-rose-50 text-rose-700 border-rose-200",
  short_natural: "bg-green-50 text-green-700 border-green-200",
};

export function CommentCard({ comment, isRegenerating, onRegenerate }: CommentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(comment.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [comment.text]);

  const labelColor = LABEL_COLORS[comment.id] ?? "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="group rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", labelColor)}>
          {comment.label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            title="Regenerate"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRegenerating && "animate-spin")} />
          </button>
          <button
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy"}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
              copied
                ? "bg-green-50 text-green-600"
                : "bg-slate-100 text-slate-600 hover:bg-primary hover:text-white"
            )}
          >
            {copied ? (
              <><Check className="h-3 w-3" /> Copied</>
            ) : (
              <><Copy className="h-3 w-3" /> Copy</>
            )}
          </button>
        </div>
      </div>

      {isRegenerating ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ) : (
        <p className="text-sm text-slate-700 leading-relaxed">
          {comment.text}
        </p>
      )}
    </div>
  );
}
