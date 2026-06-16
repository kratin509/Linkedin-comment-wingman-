"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PostInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function PostInput({ value, onChange, onGenerate, isLoading }: PostInputProps) {
  const charCount = value.length;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a LinkedIn post here..."
          className="min-h-[140px] text-sm leading-relaxed resize-none bg-white pr-16"
          disabled={isLoading}
        />
        <span className="absolute bottom-2.5 right-3 text-xs text-muted-foreground tabular-nums">
          {charCount} / 1300
        </span>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onGenerate}
          disabled={!value.trim() || isLoading}
          size="lg"
          className="gap-2 px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Comments
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
