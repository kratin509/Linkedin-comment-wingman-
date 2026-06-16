"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveProfile, type UserProfile } from "@/lib/storage";

interface ProfileTabProps {
  profile: UserProfile;
  onProfileChange: (p: UserProfile) => void;
}

export function ProfileTab({ profile, onProfileChange }: ProfileTabProps) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = { name: name.trim(), role: role.trim() };
    saveProfile(updated);
    onProfileChange(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = name.trim()
    ? name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">Profile Settings</h1>

      <div className="rounded-xl border border-border bg-white shadow-sm p-6 space-y-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-md">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-foreground">{name || "Your Name"}</p>
            <p className="text-sm text-muted-foreground">{role || "Your Role"}</p>
          </div>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Your Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              What do you do?
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Founder, Growth Marketer, ML Engineer"
            />
            <p className="text-xs text-muted-foreground">
              Used to personalize comments based on your background.
            </p>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full gap-2">
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
