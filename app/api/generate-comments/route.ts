import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/claude";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import type { GenerateRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { postText, expertise, goal, regenerateId } = body;

  if (!postText?.trim()) {
    return NextResponse.json({ error: "postText is required" }, { status: 400 });
  }

  const prompt = buildPrompt({ postText, expertise, goal, regenerateId });

  try {
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cache_control: { type: "ephemeral" } as any,
        },
      ],
      messages: [{ role: "user", content: prompt }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                new TextEncoder().encode(event.delta.text)
              );
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json(
      { error: "Generation failed. Check your API key and try again." },
      { status: 500 }
    );
  }
}
