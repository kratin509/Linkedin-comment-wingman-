"use client";

import { useState } from "react";
import { PostInput } from "@/components/PostInput";
import { SmartModePanel } from "@/components/SmartModePanel";
import { CommentGrid } from "@/components/CommentGrid";
import { useCommentGeneration } from "@/hooks/useCommentGeneration";

export default function Home() {
  const [postText, setPostText] = useState("");
  const [expertise, setExpertise] = useState("");
  const [goal, setGoal] = useState("no_goal");
  const [smartModeOpen, setSmartModeOpen] = useState(false);

  const { comments, isLoading, regeneratingId, error, generate, regenerateSingle, clearError } =
    useCommentGeneration();

  const handleGenerate = () => {
    if (!postText.trim() || isLoading) return;
    clearError();
    generate(postText, smartModeOpen ? expertise : undefined, smartModeOpen ? goal : undefined);
  };

  const handleRegenerate = (commentId: string) => {
    regenerateSingle(
      commentId,
      postText,
      smartModeOpen ? expertise : undefined,
      smartModeOpen ? goal : undefined
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <header className="mb-10 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            LinkedIn Comment Wingman
          </h1>
          <p className="text-muted-foreground">
            Comments that sound like <em>you</em>, not ChatGPT.
          </p>
        </header>

        <div className="space-y-4">
          <PostInput
            value={postText}
            onChange={setPostText}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            smartModeOpen={smartModeOpen}
            onToggleSmartMode={() => setSmartModeOpen((o) => !o)}
          />

          {smartModeOpen && (
            <SmartModePanel
              expertise={expertise}
              goal={goal}
              onExpertiseChange={setExpertise}
              onGoalChange={setGoal}
            />
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 p-4 flex items-start justify-between gap-4">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={handleGenerate}
              className="shrink-0 text-xs text-red-400 underline hover:text-red-300"
            >
              Try again
            </button>
          </div>
        )}

        {(isLoading || comments.length > 0) && !error && (
          <div className="mt-8">
            <CommentGrid
              comments={comments}
              isLoading={isLoading}
              regeneratingId={regeneratingId}
              onRegenerate={handleRegenerate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
