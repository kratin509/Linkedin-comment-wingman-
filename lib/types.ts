export interface Comment {
  id: string;
  label: string;
  text: string;
}

export interface GenerateRequest {
  postText: string;
  expertise?: string;
  goal?: string;
  regenerateId?: string;
}

export interface GenerateResponse {
  comments: Comment[];
}

export const GOAL_OPTIONS = [
  { value: "no_goal", label: "No Specific Goal" },
  { value: "get_noticed", label: "Get Noticed" },
  { value: "build_authority", label: "Build Authority" },
  { value: "start_conversation", label: "Start a Conversation" },
  { value: "network_with_author", label: "Network with Author" },
  { value: "get_reach", label: "Get Reach" },
  { value: "learn_from_author", label: "Learn from Author" },
] as const;

export const COMMENT_TYPE_LABELS: Record<string, string> = {
  reply_magnet: "Most Likely to Get a Reply",
  authority_builder: "Builds Your Authority",
  discussion_starter: "Starts Discussion",
  contrarian: "Contrarian Angle",
  short_natural: "Short & Natural",
};
