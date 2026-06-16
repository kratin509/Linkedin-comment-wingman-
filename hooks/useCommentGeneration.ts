"use client";

import { useState, useCallback } from "react";
import type { Comment } from "@/lib/types";

interface GenerateOptions {
  postText: string;
  expertise?: string;
  goal?: string;
  userContext?: string;
}

interface UseCommentGenerationReturn {
  comments: Comment[];
  isLoading: boolean;
  regeneratingId: string | null;
  error: string | null;
  generate: (opts: GenerateOptions) => Promise<void>;
  regenerateSingle: (commentId: string, opts: GenerateOptions) => Promise<void>;
  clearError: () => void;
}

async function fetchComments(body: Record<string, string | undefined>): Promise<Comment[]> {
  const response = await fetch("/api/generate-comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? "Generation failed. Please try again.");
  }

  const text = await response.text();
  const parsed = JSON.parse(text);
  if (!parsed.comments || !Array.isArray(parsed.comments)) {
    throw new Error("Unexpected response format");
  }
  return parsed.comments as Comment[];
}

export function useCommentGeneration(): UseCommentGenerationReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async ({ postText, expertise, goal, userContext }: GenerateOptions) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchComments({
        postText,
        expertise: expertise?.trim() || undefined,
        goal: goal || undefined,
        userContext: userContext?.trim() || undefined,
      });
      setComments(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const regenerateSingle = useCallback(async (commentId: string, { postText, expertise, goal, userContext }: GenerateOptions) => {
    setRegeneratingId(commentId);
    setError(null);
    try {
      const result = await fetchComments({
        postText,
        expertise: expertise?.trim() || undefined,
        goal: goal || undefined,
        userContext: userContext?.trim() || undefined,
        regenerateId: commentId,
      });
      if (result[0]) {
        setComments((prev) => prev.map((c) => (c.id === commentId ? result[0] : c)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Regeneration failed.");
    } finally {
      setRegeneratingId(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { comments, isLoading, regeneratingId, error, generate, regenerateSingle, clearError };
}
