import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST() {
  try {
    const prompt = `
        Generate ONE professional luxury fashion caption following this structure:
        [Subject] + [Fashion statement] + 
        [Anchor referencing Paris Fashion Week for Dior Autumn Winter 2026] + 
        [Authority] + 
        [Short impactful ending sentence].

        Rules:
        - Subject must always be “LingOrm”.
        - Use elevated editorial luxury vocabulary.
        - Anchor must clearly reference “Paris Fashion Week for Dior Autumn Winter 2026”.
        - Authority must reference Dior Brand Ambassadors.
        - Ending must be 4-10 words.
        - No emojis.
        - No hashtags.
        - Output only the caption.
        - Do not mention any person other than LingOrm.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a global luxury fashion editor for Vogue and Harper's Bazaar.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 150,
    });

    const caption = chatCompletion.choices[0]?.message?.content?.trim();

    return NextResponse.json({
      success: true,
      caption: caption,
    });

  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate caption" },
      { status: 500 }
    );
  }
}