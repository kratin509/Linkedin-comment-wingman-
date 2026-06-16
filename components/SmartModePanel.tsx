"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GOAL_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SmartModePanelProps {
  expertise: string;
  goal: string;
  userContext: string;
  onExpertiseChange: (value: string) => void;
  onGoalChange: (value: string) => void;
  onUserContextChange: (value: string) => void;
}

export function SmartModePanel({
  expertise,
  goal,
  userContext,
  onExpertiseChange,
  onGoalChange,
  onUserContextChange,
}: SmartModePanelProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          What do you do? <span className="font-normal normal-case">(optional)</span>
        </label>
        <Input
          value={expertise}
          onChange={(e) => onExpertiseChange(e.target.value)}
          placeholder="e.g. founder, marketer, engineer, student..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Your goal
        </label>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onGoalChange(option.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                goal === option.value
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-white text-foreground hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {goal === "authentic" && (
        <div className="space-y-1.5 animate-slide-in">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            What do you want to say? <span className="font-normal normal-case">(optional — we&apos;ll make it sound natural)</span>
          </label>
          <Textarea
            value={userContext}
            onChange={(e) => onUserContextChange(e.target.value)}
            placeholder="e.g. I agree with this, I also faced this problem in my last job, curious about the cost..."
            className="min-h-[70px] text-sm resize-none"
          />
        </div>
      )}
    </div>
  );
}
