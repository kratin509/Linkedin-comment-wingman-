"use client";

import { useEffect, useState } from "react";
import { Bookmark, Copy, Trash2 } from "lucide-react";
import { getSaved, deleteSaved, type SavedComment } from "@/lib/storage";

const LABEL_COLORS: Record<string, string> = {
  "Most Likely to Get a Reply": "bg-blue-50 text-blue-700",
  "Builds Your Authority": "bg-violet-50 text-violet-700",
  "Starts Discussion": "bg-amber-50 text-amber-700",
  "Contrarian Angle": "bg-rose-50 text-rose-700",
  "Short & Natural": "bg-green-50 text-green-700",
};

export function SavedTab() {
  const [saved, setSaved] = useState<SavedComment[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setSaved(getSaved());
  }, []);

  const handleDelete = (id: string) => {
    deleteSaved(id);
    setSaved((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCopy = async (item: SavedComment) => {
    await navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (saved.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">Saved Comments</h1>
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <Bookmark className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No saved comments yet. Hit Save on any comment to keep it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Saved Comments</h1>
        <p className="text-xs text-muted-foreground">{saved.length} saved</p>
      </div>

      <div className="space-y-3">
        {saved.map((item) => {
          const labelColor = LABEL_COLORS[item.label] ?? "bg-slate-50 text-slate-700";
          return (
            <div key={item.id} className="rounded-xl border border-border bg-white shadow-sm p-4">
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${labelColor}`}>
                  {item.label}
                </span>
                <p className="text-xs text-muted-foreground shrink-0">{formatDate(item.savedAt)}</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">{item.text}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-border rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  {copiedId === item.id ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-rose-500 border border-rose-200 rounded-lg px-3 py-1.5 hover:bg-rose-50 transition-colors ml-auto"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
