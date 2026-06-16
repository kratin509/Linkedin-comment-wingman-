"use client";

import { useState } from "react";
import { PostInput } from "@/components/PostInput";
import { SmartModePanel } from "@/components/SmartModePanel";
import { CommentGrid } from "@/components/CommentGrid";
import { useCommentGeneration } from "@/hooks/useCommentGeneration";

export default function Home() {
  const [postText, setPostText] = useState("");
  const [expertise, setExpertise] = useState("");
  const [goal, setGoal] = useState("authentic");
  const [userContext, setUserContext] = useState("");

  const { comments, isLoading, regeneratingId, error, generate, regenerateSingle, clearError } =
    useCommentGeneration();

  const opts = { postText, expertise, goal, userContext };

  const handleGenerate = () => {
    if (!postText.trim() || isLoading) return;
    clearError();
    generate(opts);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
            in
          </div>
          <span className="font-semibold text-foreground">Comment Wingman</span>
          <span className="ml-auto text-xs text-muted-foreground">
            Comments that sound like <em>you</em>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-5">
        <PostInput
          value={postText}
          onChange={setPostText}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

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
            <button
              onClick={handleGenerate}
              className="shrink-0 text-xs text-red-500 underline hover:text-red-700"
            >
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
          />
        )}
      </main>
    </div>
  );
}
