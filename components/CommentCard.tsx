"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/types";

interface CommentCardProps {
  comment: Comment;
  isRegenerating: boolean;
  onRegenerate: () => void;
}

export function CommentCard({ comment, isRegenerating, onRegenerate }: CommentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(comment.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [comment.text]);

  return (
    <Card className="group min-h-[140px] animate-fade-in transition-colors hover:border-border/80">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="default" className="shrink-0">
            {comment.label}
          </Badge>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Regenerate this comment"
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", isRegenerating && "animate-spin")}
              />
            </button>
            <button
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy to clipboard"}
              aria-label={copied ? "Copied!" : "Copy to clipboard"}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400 transition-colors duration-150" />
              ) : (
                <Copy className="h-3.5 w-3.5 transition-colors duration-150" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isRegenerating ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[90%]" />
            <Skeleton className="h-3 w-[70%]" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {comment.text}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
