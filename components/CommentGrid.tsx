import { CommentCard } from "@/components/CommentCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import type { Comment } from "@/lib/types";

interface CommentGridProps {
  comments: Comment[];
  isLoading: boolean;
  regeneratingId: string | null;
  onRegenerate: (id: string) => void;
}

export function CommentGrid({
  comments,
  isLoading,
  regeneratingId,
  onRegenerate,
}: CommentGridProps) {
  if (isLoading && comments.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (comments.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          isRegenerating={regeneratingId === comment.id}
          onRegenerate={() => onRegenerate(comment.id)}
        />
      ))}
    </div>
  );
}
