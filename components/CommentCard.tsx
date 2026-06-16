"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Bookmark, BookmarkCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/types";

interface CommentCardProps {
  comment: Comment;
  isRegenerating: boolean;
  onRegenerate: () => void;
  onSave?: (comment: Comment) => void;
  isSaved?: boolean;
}

const LABEL_COLORS: Record<string, string> = {
  reply_magnet: "bg-blue-50 text-blue-700 border-blue-200",
  authority_builder: "bg-violet-50 text-violet-700 border-violet-200",
  discussion_starter: "bg-amber-50 text-amber-700 border-amber-200",
  contrarian: "bg-rose-50 text-rose-700 border-rose-200",
  short_natural: "bg-green-50 text-green-700 border-green-200",
};

export function CommentCard({ comment, isRegenerating, onRegenerate, onSave, isSaved }: CommentCardProps) {
  const [copied, setCopied] = useState(false);
  const [used, setUsed] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(comment.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [comment.text]);

  const handleUse = useCallback(async () => {
    await navigator.clipboard.writeText(comment.text);
    setUsed(true);
    setTimeout(() => setUsed(false), 2500);
  }, [comment.text]);

  const labelColor = LABEL_COLORS[comment.id] ?? "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", labelColor)}>
          {comment.label}
        </span>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          title="Regenerate"
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRegenerating && "animate-spin")} />
        </button>
      </div>

      {/* Text */}
      <div className="px-4 pb-3 min-h-[48px]">
        {isRegenerating ? (
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ) : (
          <p className="text-sm text-slate-700 leading-relaxed">{comment.text}</p>
        )}
      </div>

      {/* Quality badges */}
      {!isRegenerating && (
        <div className="px-4 pb-3 flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
            <Check className="h-2.5 w-2.5" /> Authentic
          </span>
          <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
            <Check className="h-2.5 w-2.5" /> Engaging
          </span>
          <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full font-medium border border-slate-200">
            Relevant
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-4 pt-1 border-t border-border/50 flex items-center gap-2">
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
            copied
              ? "border-green-200 bg-green-50 text-green-600"
              : "border-border text-slate-600 hover:bg-slate-50"
          )}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>

        {onSave && (
          <button
            onClick={() => onSave(comment)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              isSaved
                ? "border-primary/30 bg-primary/5 text-primary"
                : "border-border text-slate-600 hover:bg-slate-50"
            )}
          >
            {isSaved ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
            {isSaved ? "Saved" : "Save"}
          </button>
        )}

        <button
          onClick={handleUse}
          className={cn(
            "ml-auto rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
            used
              ? "bg-green-500 text-white"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {used ? "✓ Copied to clipboard!" : "Use This Comment"}
        </button>
      </div>
    </div>
  );
}
