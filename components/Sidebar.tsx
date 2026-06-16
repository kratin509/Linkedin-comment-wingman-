"use client";

import { Sparkles, Clock, Bookmark, User, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/storage";

export type Tab = "generate" | "history" | "saved" | "profile" | "help";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "generate", label: "Generate Comments", icon: Sparkles },
  { id: "history", label: "History", icon: Clock },
  { id: "saved", label: "Saved Comments", icon: Bookmark },
  { id: "profile", label: "Profile Settings", icon: User },
  { id: "help", label: "Help & Feedback", icon: HelpCircle },
];

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  profile: UserProfile;
}

export function Sidebar({ activeTab, onTabChange, profile }: SidebarProps) {
  return (
    <div className="w-56 shrink-0 bg-white border-r border-border flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold select-none">
          in
        </div>
        <span className="font-bold text-foreground text-lg tracking-tight">Wingman</span>
      </div>

      <nav className="flex-1 p-2.5 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === id
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      <div className="m-3 rounded-xl bg-gradient-to-br from-primary/8 to-blue-100/50 border border-primary/10 p-4 text-center space-y-2.5">
        <div className="flex justify-center gap-1">
          <span className="text-xl">💬</span>
          <span className="text-xl">✨</span>
        </div>
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          Create impactful LinkedIn comments that get noticed.
        </p>
        <button className="w-full rounded-lg bg-primary text-white text-xs font-semibold py-2 hover:bg-primary/90 transition-colors">
          Upgrade to Pro
        </button>
      </div>

      {profile.name && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-slate-50 cursor-pointer" onClick={() => onTabChange("profile")}>
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{profile.name}</p>
              {profile.role && <p className="text-xs text-muted-foreground truncate">{profile.role}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
