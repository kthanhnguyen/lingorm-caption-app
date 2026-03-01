import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// 1. Danh sách 5 API Keys của bạn (Cho vào file .env)
const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3,
  process.env.GROQ_KEY_4,
  // process.env.GROQ_KEY_5,
].filter(Boolean); // Lọc bỏ các key trống

// 2. Bộ từ vựng (Fallback Engine)
const hooks = ["At Paris Fashion Week,", "Gracing Dior AW26,", "In the Dior atelier,", "Commanding the front row,", "A new era unfolds as"];
const actions = ["redefines", "manifests", "anchors", "elevates", "transforms"];
const vibes = ["architectural", "avant-garde", "ethereal", "minimalist", "quintessential"];
const endings = ["A style masterclass.", "Heritage reimagined.", "Pure couture.", "The gold standard."];

export async function POST() {
  // Chọn ngẫu nhiên bộ khung trước
  const h = hooks[Math.floor(Math.random() * hooks.length)];
  const a = actions[Math.floor(Math.random() * actions.length)];
  const v = vibes[Math.floor(Math.random() * vibes.length)];
  const e = endings[Math.floor(Math.random() * endings.length)];
  const fallbackCaption = `${h} LingOrm ${a} a ${v} silhouette for Dior Autumn Winter 2026 as global Brand Ambassadors. ${e}`;

  // 3. Chọn ngẫu nhiên 1 Key trong mảng 5 Key để dùng
  const randomKey = GROQ_KEYS[Math.floor(Math.random() * GROQ_KEYS.length)];
  
  if (!randomKey) {
     return NextResponse.json({ success: true, caption: fallbackCaption, source: "Direct_Logic" });
  }

  const groq = new Groq({ apiKey: randomKey });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a Vogue editor. Rewrite briefly. Subject: LingOrm (models)." },
        { role: "user", content: fallbackCaption }
      ],
      model: "llama-3.1-8b-instant", // Model này trâu nhất cho 100k request
      temperature: 0.8,
      max_tokens: 50,
    });

    const aiResult = chatCompletion.choices[0]?.message?.content?.trim();
    
    // Kiểm tra chất lượng AI trả về (Tránh bị cắt chữ)
    if (!aiResult || aiResult.length < 40) throw new Error("AI incomplete");

    return NextResponse.json({ success: true, caption: aiResult, source: "AI" });

  } catch (error) {
    // 4. Nếu sập (Rate limit 429), trả về câu Fallback cực nhanh
    return NextResponse.json({ success: true, caption: fallbackCaption, source: "Fallback" });
  }
}