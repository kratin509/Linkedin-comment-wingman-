"use client";

import { useEffect, useState } from "react";
import { Clock, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { getHistory, clearHistory, type HistoryItem } from "@/lib/storage";

export function HistoryTab() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">History</h1>
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <Clock className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No history yet. Generate some comments first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">History</h1>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear all
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{item.postPreview}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(item.date)} · {item.comments.length} comments</p>
              </div>
              {expanded === item.id
                ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-3" />
                : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-3" />
              }
            </button>

            {expanded === item.id && (
              <div className="border-t border-border px-4 pb-4 pt-3 space-y-2.5">
                {item.comments.map((c) => (
                  <div key={c.id} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{c.label}</p>
                    <p className="text-sm text-foreground">{c.text}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(c.text)}
                      className="mt-2 text-xs text-primary font-medium hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
