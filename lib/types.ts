export interface Comment {
  id: string;
  label: string;
  text: string;
}

export interface GenerateRequest {
  postText: string;
  expertise?: string;
  goal?: string;
  userContext?: string;
  regenerateId?: string;
}

export interface GenerateResponse {
  comments: Comment[];
}

export const GOAL_OPTIONS = [
  { value: "reach", label: "Commenting for Reach", icon: "📢" },
  { value: "network", label: "Network with Author", icon: "🤝" },
  { value: "convo", label: "Start a Convo", icon: "💬" },
  { value: "authentic", label: "No Specific Goal", icon: "✨" },
] as const;

export type GoalValue = typeof GOAL_OPTIONS[number]["value"];

export const COMMENT_TYPE_LABELS: Record<string, string> = {
  reply_magnet: "Most Likely to Get a Reply",
  authority_builder: "Builds Your Authority",
  discussion_starter: "Starts Discussion",
  contrarian: "Contrarian Angle",
  short_natural: "Short & Natural",
};
