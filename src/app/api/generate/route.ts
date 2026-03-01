import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Đưa ra ngoài để tiết kiệm tài nguyên server
const GROQ_KEYS = [
  process.env.GROQ_KEY_1, process.env.GROQ_KEY_2, process.env.GROQ_KEY_3,
  process.env.GROQ_KEY_4, process.env.GROQ_KEY_5, process.env.GROQ_KEY_6,
  process.env.GROQ_KEY_7, process.env.GROQ_KEY_8, process.env.GROQ_KEY_9,
  process.env.GROQ_KEY_10, process.env.GROQ_KEY_11, process.env.GROQ_KEY_12,
  process.env.GROQ_KEY_13, process.env.GROQ_KEY_14, process.env.GROQ_KEY_15,
  process.env.GROQ_KEY_16,
].filter(Boolean);

const hooks = ["At Paris Fashion Week,", "Gracing the Dior AW26 showcase,", "In the heart of the Dior atelier,", "Commanding the front row in Paris,", "Defining a new sartorial era,", "Amidst the grandeur of Dior,", "Captured in the essence of Paris,", "Elevating the seasonal narrative,", "A visionary moment unfolds as,", "Against the backdrop of heritage,"];
const actions = ["redefines", "manifests", "anchors", "elevates", "transforms", "portrays", "projects", "sculpts", "interprets", "articulates"];
const vibes = ["architectural", "avant-garde", "ethereal", "minimalist", "quintessential", "visionary", "majestic", "sculptural", "understated", "opulent"];
const endings = ["A masterclass in style.", "Heritage reimagined.", "Pure couture elegance.", "The gold standard of luxury.", "A visionary narrative of craft.", "The dawn of a new legacy."];

export async function POST() {
  // 1. Tạo sẵn câu dự phòng (Tốc độ 0ms)
  const h = hooks[Math.floor(Math.random() * hooks.length)];
  const a = actions[Math.floor(Math.random() * actions.length)];
  const v = vibes[Math.floor(Math.random() * vibes.length)];
  const e = endings[Math.floor(Math.random() * endings.length)];
  const seedText = `${h} LingOrm ${a} a ${v} silhouette for Dior Autumn Winter 2026. ${e}`;

  // 2. Trộn 16 Keys
  const shuffledKeys = [...GROQ_KEYS].sort(() => Math.random() - 0.5);

  // 3. Vòng lặp thử Key
  for (const key of shuffledKeys) {
    try {
      const groq = new Groq({ apiKey: key });

      // Thêm AbortController để ngắt nếu AI quá chậm (tránh treo 1000 máy tính)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 giây không xong là bỏ

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a luxury fashion editor. Rewrite the input into ONE elegant, unique English sentence. No hashtags, no quotes." },
          { role: "user", content: `Rewrite: ${seedText}` }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 1.1,
        presence_penalty: 1.8,
      }, { signal: controller.signal });

      clearTimeout(timeoutId);
      const aiResult = chatCompletion.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g, '');

      if (aiResult && aiResult.length > 20) {
        return NextResponse.json({ success: true, caption: aiResult });
      }
    } catch (error) {
      // Nếu Key lỗi hoặc Timeout, tiếp tục thử Key khác
      continue;
    }
  }

  // 4. CHỐT HẠ: Nếu 1000 máy tính vào cùng lúc làm nghẽn AI, trả về câu Ma trận ngay
  return NextResponse.json({ success: true, caption: seedText });
}