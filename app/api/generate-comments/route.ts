import { NextRequest, NextResponse } from "next/server";
import genAI from "@/lib/claude";
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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContentStream(prompt);

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
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
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Generation failed. Check your API key and try again." },
      { status: 500 }
    );
  }
}
