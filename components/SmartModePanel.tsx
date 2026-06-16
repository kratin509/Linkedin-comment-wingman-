import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOAL_OPTIONS } from "@/lib/types";

interface SmartModePanelProps {
  expertise: string;
  goal: string;
  onExpertiseChange: (value: string) => void;
  onGoalChange: (value: string) => void;
}

export function SmartModePanel({
  expertise,
  goal,
  onExpertiseChange,
  onGoalChange,
}: SmartModePanelProps) {
  return (
    <div className="animate-slide-in rounded-xl border border-border/50 bg-muted/30 p-4 space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          What do you do?
        </label>
        <Input
          value={expertise}
          onChange={(e) => onExpertiseChange(e.target.value)}
          placeholder="e.g. SaaS founder, growth marketer, ML engineer"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Your goal with this comment
        </label>
        <Select value={goal} onValueChange={onGoalChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a goal..." />
          </SelectTrigger>
          <SelectContent>
            {GOAL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground">
        Both fields are optional. Leave blank for universally good comments.
      </p>
    </div>
  );
}
