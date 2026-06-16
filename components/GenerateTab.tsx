"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { PostInput } from "@/components/PostInput";
import { SmartModePanel } from "@/components/SmartModePanel";
import { CommentGrid } from "@/components/CommentGrid";
import { useCommentGeneration } from "@/hooks/useCommentGeneration";
import { saveToHistory, saveComment, getSaved } from "@/lib/storage";
import type { Comment } from "@/lib/types";

const TIPS = [
  "Be authentic, add value, and start meaningful conversations.",
  "Ask a question to increase your chances of a reply.",
  "Short comments that add insight get more engagement.",
  "Comment within the first hour of a post for maximum reach.",
];

export function GenerateTab() {
  const [postText, setPostText] = useState("");
  const [expertise, setExpertise] = useState("");
  const [goal, setGoal] = useState("authentic");
  const [userContext, setUserContext] = useState("");
  const [savedTexts, setSavedTexts] = useState<Set<string>>(new Set());
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  const { comments, isLoading, regeneratingId, error, generate, regenerateSingle, clearError } =
    useCommentGeneration();

  useEffect(() => {
    const saved = getSaved();
    setSavedTexts(new Set(saved.map((s) => s.text)));
  }, []);

  const opts = { postText, expertise, goal, userContext };

  const handleGenerate = () => {
    if (!postText.trim() || isLoading) return;
    clearError();
    generate(opts).then(() => {
      // save to history after generation — handled via effect below
    });
  };

  useEffect(() => {
    if (comments.length > 0 && postText.trim()) {
      saveToHistory({
        postText,
        postPreview: postText.slice(0, 80) + (postText.length > 80 ? "…" : ""),
        comments,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments]);

  const handleSave = (comment: Comment) => {
    if (savedTexts.has(comment.text)) return;
    saveComment({ text: comment.text, label: comment.label });
    setSavedTexts((prev) => { const next = new Set(prev); next.add(comment.text); return next; });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">LinkedIn Comment Wingman</h1>
        <p className="text-muted-foreground mt-0.5">
          Smart comments that sound like <em>you</em>, not AI.
        </p>
      </div>

      <PostInput
        value={postText}
        onChange={setPostText}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />

      {postText.length === 0 && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
          <span>Tip: {tip}</span>
        </div>
      )}

      <SmartModePanel
        expertise={expertise}
        goal={goal}
        userContext={userContext}
        onExpertiseChange={setExpertise}
        onGoalChange={setGoal}
        onUserContextChange={setUserContext}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={handleGenerate} className="shrink-0 text-xs text-red-500 underline hover:text-red-700">
            Try again
          </button>
        </div>
      )}

      {(isLoading || comments.length > 0) && !error && (
        <CommentGrid
          comments={comments}
          isLoading={isLoading}
          regeneratingId={regeneratingId}
          onRegenerate={(id) => regenerateSingle(id, opts)}
          onSave={handleSave}
          savedIds={savedTexts}
        />
      )}
    </div>
  );
}
