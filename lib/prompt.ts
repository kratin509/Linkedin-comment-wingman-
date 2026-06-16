export const SYSTEM_PROMPT = `You are a LinkedIn comment writer who sounds like a real person. You write short, direct, human comments — never corporate fluff, never AI-sounding phrases.

Rules you never break:
- Every comment is 1 sentence. Maximum 25 words. No exceptions.
- Zero hype words: no "insightful", "impactful", "resonate", "game-changer", "fantastic", "incredible", "absolutely", "love this", "great post"
- Never start with flattery
- Simple everyday English only
- Sound like a real person thinking out loud

You always respond with valid JSON only. No markdown fences, no preamble.`;

const GOAL_INSTRUCTIONS: Record<string, string> = {
  reach:
    "Goal: GET REACH. Write comments that other people in the feed will also like or reply to — not just the author. Broadly relatable, slightly provocative or interesting.",
  network:
    "Goal: NETWORK WITH AUTHOR. Write comments that make the author want to connect with this person. Personal, warm, shows genuine interest in them specifically.",
  convo:
    "Goal: START A CONVERSATION. Each comment should end with a question or observation that makes people want to reply — both the author and other readers.",
  authentic:
    "Goal: JUST BE AUTHENTIC. Write what a real person would naturally say when they actually read this post. No strategy, just genuine reaction.",
};

const COMMENT_TYPE_INSTRUCTIONS: Record<string, string> = {
  reply_magnet:
    "Ask one specific question that only someone who actually read this post could ask. Make the author want to reply.",
  authority_builder:
    "Add one sharp observation or fact that shows you know this space. No flattery.",
  discussion_starter:
    "Say something that makes other readers want to weigh in. A light opinion or question that opens a thread.",
  contrarian:
    "Push back on one thing in the post, politely. Show you thought about it critically.",
  short_natural:
    "Write what a real person would type in 5 seconds after reading this. Casual, genuine, short.",
};

interface BuildPromptOptions {
  postText: string;
  expertise?: string;
  goal?: string;
  userContext?: string;
  regenerateId?: string;
}

export function buildPrompt({
  postText,
  expertise,
  goal,
  userContext,
  regenerateId,
}: BuildPromptOptions): string {
  const expertiseBlock = expertise?.trim()
    ? `\nCOMMENTER BACKGROUND: ${expertise.trim()}. Let this naturally shape their perspective — don't force it.\n`
    : "";

  const goalBlock =
    goal && GOAL_INSTRUCTIONS[goal]
      ? `\n${GOAL_INSTRUCTIONS[goal]}\n`
      : "";

  const userContextBlock = userContext?.trim()
    ? `\nTHE COMMENTER WANTS TO CONVEY: "${userContext.trim()}"\nTurn this into natural LinkedIn comments that express this idea authentically.\n`
    : "";

  const lengthRule = "CRITICAL: Each comment = 1 sentence, max 25 words. Short is powerful.";

  if (regenerateId) {
    const instruction = COMMENT_TYPE_INSTRUCTIONS[regenerateId] ?? "";
    const label = {
      reply_magnet: "Most Likely to Get a Reply",
      authority_builder: "Builds Your Authority",
      discussion_starter: "Starts Discussion",
      contrarian: "Contrarian Angle",
      short_natural: "Short & Natural",
    }[regenerateId] ?? regenerateId;

    return `POST:
${postText}
${expertiseBlock}${goalBlock}${userContextBlock}
TASK: Write ONE LinkedIn comment. Type: ${label}.
${instruction}

${lengthRule}
No hype words. No flattery opener. Simple English.

OUTPUT (JSON only):
{"comments":[{"id":"${regenerateId}","label":"${label}","text":"..."}]}`;
  }

  return `POST:
${postText}
${expertiseBlock}${goalBlock}${userContextBlock}
TASK: Write 5 LinkedIn comments. Each must be different in angle. All must sound like a real person.

${lengthRule}
No hype words. No flattery opener. No "Great post!" or similar. Simple English only.

OUTPUT (JSON only):
{
  "comments": [
    {"id":"reply_magnet","label":"Most Likely to Get a Reply","text":"..."},
    {"id":"authority_builder","label":"Builds Your Authority","text":"..."},
    {"id":"discussion_starter","label":"Starts Discussion","text":"..."},
    {"id":"contrarian","label":"Contrarian Angle","text":"..."},
    {"id":"short_natural","label":"Short & Natural","text":"..."}
  ]
}

Comment 1 (reply_magnet): ${COMMENT_TYPE_INSTRUCTIONS.reply_magnet}
Comment 2 (authority_builder): ${COMMENT_TYPE_INSTRUCTIONS.authority_builder}
Comment 3 (discussion_starter): ${COMMENT_TYPE_INSTRUCTIONS.discussion_starter}
Comment 4 (contrarian): ${COMMENT_TYPE_INSTRUCTIONS.contrarian}
Comment 5 (short_natural): ${COMMENT_TYPE_INSTRUCTIONS.short_natural}`;
}
