"use client";

import { Sparkles, Loader2, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  smartModeOpen: boolean;
  onToggleSmartMode: () => void;
}

export function PostInput({
  value,
  onChange,
  onGenerate,
  isLoading,
  smartModeOpen,
  onToggleSmartMode,
}: PostInputProps) {
  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a LinkedIn post here..."
        className="min-h-[140px] text-sm leading-relaxed"
        disabled={isLoading}
      />
      {value.length > 1000 && (
        <p className="text-xs text-muted-foreground">
          LinkedIn posts are typically 1,300 characters or less.
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggleSmartMode}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              smartModeOpen && "rotate-180"
            )}
          />
          Tweak for my profile
        </button>
        <Button
          onClick={onGenerate}
          disabled={!value.trim() || isLoading}
          className="gap-2"
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
