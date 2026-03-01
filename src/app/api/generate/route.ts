import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const GROQ_KEYS = [
  process.env.GROQ_KEY_1, process.env.GROQ_KEY_2, process.env.GROQ_KEY_3,
  process.env.GROQ_KEY_4, process.env.GROQ_KEY_5, process.env.GROQ_KEY_6,
  process.env.GROQ_KEY_7, process.env.GROQ_KEY_8, process.env.GROQ_KEY_9, 
  process.env.GROQ_KEY_10, process.env.GROQ_KEY_11, process.env.GROQ_KEY_12, 
  process.env.GROQ_KEY_13, process.env.GROQ_KEY_14, process.env.GROQ_KEY_15,
  process.env.GROQ_KEY_16,
].filter(Boolean);

// Nâng cấp Ma trận từ vựng lên thêm 20% để đảm bảo AI có nhiều "nguyên liệu" hơn
const hooks = ["At Paris Fashion Week,", "Gracing the Dior AW26 showcase,", "In the heart of the Dior atelier,", "Commanding the front row in Paris,", "Defining a new sartorial era,", "Amidst the grandeur of Dior,", "Captured in the essence of Paris,", "Elevating the seasonal narrative,", "A visionary moment unfolds as,", "Against the backdrop of heritage,", "Witnessing the couture evolution,"];
const actions = ["redefines", "manifests", "anchors", "elevates", "transforms", "portrays", "projects", "sculpts", "interprets", "articulates", "crystallizes"];
const vibes = ["architectural", "avant-garde", "ethereal", "minimalist", "quintessential", "visionary", "majestic", "sculptural", "understated", "opulent", "aristocratic"];
const endings = ["A masterclass in style.", "Heritage reimagined.", "Pure couture elegance.", "The gold standard of luxury.", "A visionary narrative of craft.", "The dawn of a new legacy.", "Sartorial excellence defined."];

export async function POST() {
  const h = hooks[Math.floor(Math.random() * hooks.length)];
  const a = actions[Math.floor(Math.random() * actions.length)];
  const v = vibes[Math.floor(Math.random() * vibes.length)];
  const e = endings[Math.floor(Math.random() * endings.length)];
  const seedText = `${h} LingOrm ${a} a ${v} silhouette for Dior Autumn Winter 2026. ${e}`;

  // 1. Luôn Shuffle Keys mỗi khi có request để chia đều tải
  const shuffledKeys = [...GROQ_KEYS].sort(() => Math.random() - 0.5);

  for (const key of shuffledKeys) {
    try {
      const groq = new Groq({ apiKey: key });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are a luxury fashion editor for Vogue. Rewrite the input into ONE original, fluid, and high-fashion English sentence. Subject: LingOrm (Dior Ambassadors). STRICT: No hashtags, no quotes, no conversational filler. Output ONLY the polished sentence." 
          },
          { role: "user", content: `Rewrite elegantly: ${seedText}` }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 1.1, // Tăng nhẹ để AI bay bổng hơn, tránh trùng lặp
        max_tokens: 100,
        presence_penalty: 1.8, // Tăng lên 1.8 để ép AI dùng từ vựng mới hoàn toàn
        frequency_penalty: 1.5, // Phạt nặng nếu lặp lại cấu trúc câu
      });

      let aiResult = chatCompletion.choices[0]?.message?.content?.trim() || "";
      
      // 2. Logic làm sạch triệt để: Xóa mọi dấu ngoặc kép hoặc lời dẫn của AI
      aiResult = aiResult.replace(/^["']|["']$/g, '').replace(/^Rewrite: /i, '');
      
      if (aiResult.length > 30) {
        return NextResponse.json({ success: true, caption: aiResult, source: "AI" });
      }

    } catch (error) {
      console.warn("Key rate limited, trying next...");
      continue; 
    }
  }

  // 3. Fallback: Nếu sập toàn bộ, trả về câu logic cực nhanh
  return NextResponse.json({ success: true, caption: seedText, source: "Logic" });
}