"use client";

import { useState, useEffect } from "react";
import { Sidebar, type Tab } from "@/components/Sidebar";
import { GenerateTab } from "@/components/GenerateTab";
import { HistoryTab } from "@/components/HistoryTab";
import { SavedTab } from "@/components/SavedTab";
import { ProfileTab } from "@/components/ProfileTab";
import { getProfile, type UserProfile } from "@/lib/storage";

function HelpTab() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">Help & Feedback</h1>
      <div className="rounded-xl border border-border bg-white shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground mb-1">How does it work?</h2>
          <p className="text-sm text-muted-foreground">Paste any LinkedIn post, pick your goal, and click Generate. We&apos;ll write 5 authentic, human-sounding comments tailored to your objective.</p>
        </div>
        <hr className="border-border" />
        <div>
          <h2 className="font-semibold text-foreground mb-1">Why are comments so short?</h2>
          <p className="text-sm text-muted-foreground">Short, specific comments get more replies than long ones. One clear thought beats three vague sentences every time on LinkedIn.</p>
        </div>
        <hr className="border-border" />
        <div>
          <h2 className="font-semibold text-foreground mb-1">What&apos;s &ldquo;No Specific Goal&rdquo;?</h2>
          <p className="text-sm text-muted-foreground">Type what you genuinely want to say in plain words, and the AI will turn it into a natural LinkedIn comment that doesn&apos;t sound AI-generated.</p>
        </div>
        <hr className="border-border" />
        <div>
          <h2 className="font-semibold text-foreground mb-2">Send feedback</h2>
          <p className="text-sm text-muted-foreground">Found a bug or have a suggestion? Reach out — we read everything.</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("generate");
  const [profile, setProfile] = useState<UserProfile>({ name: "", role: "" });

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={tab} onTabChange={setTab} profile={profile} />

      {/* Header + content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 bg-white border-b border-border flex items-center justify-end px-6 gap-3">
          {profile.name ? (
            <button
              onClick={() => setTab("profile")}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <span className="text-sm font-medium text-foreground hidden sm:block">{profile.name}</span>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                {profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            </button>
          ) : (
            <button
              onClick={() => setTab("profile")}
              className="text-xs font-medium text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors"
            >
              Set up profile →
            </button>
          )}
        </header>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {tab === "generate" && <GenerateTab />}
          {tab === "history" && <HistoryTab />}
          {tab === "saved" && <SavedTab />}
          {tab === "profile" && <ProfileTab profile={profile} onProfileChange={setProfile} />}
          {tab === "help" && <HelpTab />}
        </main>
      </div>
    </div>
  );
}
