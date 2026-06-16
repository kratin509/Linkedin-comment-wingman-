export const SYSTEM_PROMPT = `You are an expert LinkedIn ghostwriter who specializes in authentic, high-performing comments. You deeply understand what makes LinkedIn comments get noticed, replied to, and remembered — versus what gets ignored.

You write comments that:
- Sound like real humans, not AI or corporate marketing copy
- Add genuine value to the conversation
- Are strategically optimized for the commenter's goals
- Reflect the commenter's actual background and voice when provided
- Never use hollow engagement bait language

You always respond with valid JSON only, exactly as specified. No markdown fences, no preamble, no explanation outside the JSON.`;

const GOAL_INSTRUCTIONS: Record<string, string> = {
  get_noticed:
    "The commenter's goal is to GET NOTICED by the author and their audience. Optimize for memorability and standing out in a thread.",
  build_authority:
    "The commenter's goal is to BUILD AUTHORITY in their field. Every comment should reinforce their expertise positioning.",
  start_conversation:
    "The commenter's goal is to START A CONVERSATION. Prioritize comments that open dialogue over one-way statements.",
  network_with_author:
    "The commenter's goal is to NETWORK WITH THE AUTHOR specifically. Make the comment feel personal and targeted to them.",
  get_reach:
    "The commenter's goal is to GET REACH. Comments should be broadly interesting to the author's entire audience, encouraging likes and replies from others.",
  learn_from_author:
    "The commenter's goal is to LEARN FROM THE AUTHOR. Show genuine curiosity and ask questions that would elicit valuable insights from them.",
};

const COMMENT_TYPE_INSTRUCTIONS: Record<string, string> = {
  reply_magnet:
    "Write a comment designed to compel the author to respond. Ask a specific, thoughtful question or make an observation that invites dialogue. Show you actually read their post carefully.",
  authority_builder:
    "Write a comment that adds genuine value and showcases expertise. Share a specific insight, data point, or nuanced perspective that demonstrates deep knowledge. Don't be sycophantic.",
  discussion_starter:
    "Write a comment that sparks a thread. Introduce a related angle, sub-topic, or question that other readers will want to weigh in on. Make it interesting to the broader audience.",
  contrarian:
    "Write a respectfully contrarian comment. Challenge an assumption in the post, offer a counterpoint, or highlight a nuance the author missed — without being rude or dismissive.",
  short_natural:
    "Write a short, conversational comment (1-3 sentences max). Sound like a real human who briefly reacted genuinely. No buzzwords, no forced enthusiasm.",
};

interface BuildPromptOptions {
  postText: string;
  expertise?: string;
  goal?: string;
  regenerateId?: string;
}

export function buildPrompt({
  postText,
  expertise,
  goal,
  regenerateId,
}: BuildPromptOptions): string {
  const expertiseBlock =
    expertise?.trim()
      ? `\n## COMMENTER CONTEXT\nThe commenter is a ${expertise.trim()}. They naturally see everything through that lens. When analyzing the LinkedIn post, consider what aspects would be most salient, relevant, or interesting to someone with this background. Their comments should subtly reflect this perspective where it adds authenticity and value — not forced, just natural.\n`
      : "";

  const goalBlock =
    goal && goal !== "no_goal" && GOAL_INSTRUCTIONS[goal]
      ? `\n## COMMENTER GOAL\n${GOAL_INSTRUCTIONS[goal]}\n`
      : "";

  const expertiseRule = expertise?.trim()
    ? "- Reflect the commenter's professional background subtly and authentically"
    : "";
  const goalRule =
    goal && goal !== "no_goal"
      ? "- Optimize every comment toward the stated goal"
      : "";

  if (regenerateId) {
    const instruction = COMMENT_TYPE_INSTRUCTIONS[regenerateId] ?? "";
    const label = {
      reply_magnet: "Most Likely to Get a Reply",
      authority_builder: "Builds Your Authority",
      discussion_starter: "Starts Discussion",
      contrarian: "Contrarian Angle",
      short_natural: "Short & Natural",
    }[regenerateId] ?? regenerateId;

    return `## LINKEDIN POST
\`\`\`
${postText}
\`\`\`
${expertiseBlock}${goalBlock}
## YOUR TASK
Generate ONE LinkedIn comment for the post above.

Comment type: **${label}**
${instruction}

**Rules:**
- Never start with "Great post!", "Love this!", "Such an insightful..." or similar hollow openers
- No hashtags unless they appear naturally in context
- No emojis unless the commenter's style would naturally include them
- Sound authentic, specific, and human
${expertiseRule}
${goalRule}

## OUTPUT FORMAT
Respond with a valid JSON object only:
{
  "comments": [
    { "id": "${regenerateId}", "label": "${label}", "text": "..." }
  ]
}`;
  }

  return `## LINKEDIN POST
\`\`\`
${postText}
\`\`\`
${expertiseBlock}${goalBlock}
## YOUR TASK
Generate exactly 5 distinct LinkedIn comments for the post above. Each comment must serve a different strategic purpose. Write comments that sound like a real human wrote them — not AI-generated corporate speak.

**Rules:**
- Never start with "Great post!", "Love this!", "Such an insightful..." or similar hollow openers
- No hashtags unless they appear naturally in context
- No emojis unless the commenter's style would naturally include them
- Each comment must be substantively different in angle and approach
- Sound authentic, specific, and human
${expertiseRule}
${goalRule}

## OUTPUT FORMAT
Respond with a valid JSON object only:
{
  "comments": [
    { "id": "reply_magnet", "label": "Most Likely to Get a Reply", "text": "..." },
    { "id": "authority_builder", "label": "Builds Your Authority", "text": "..." },
    { "id": "discussion_starter", "label": "Starts Discussion", "text": "..." },
    { "id": "contrarian", "label": "Contrarian Angle", "text": "..." },
    { "id": "short_natural", "label": "Short & Natural", "text": "..." }
  ]
}

### Comment 1: Most Likely to Get a Reply
${COMMENT_TYPE_INSTRUCTIONS.reply_magnet}

### Comment 2: Builds Your Authority
${COMMENT_TYPE_INSTRUCTIONS.authority_builder}

### Comment 3: Starts Discussion
${COMMENT_TYPE_INSTRUCTIONS.discussion_starter}

### Comment 4: Contrarian Angle
${COMMENT_TYPE_INSTRUCTIONS.contrarian}

### Comment 5: Short & Natural
${COMMENT_TYPE_INSTRUCTIONS.short_natural}`;
}
