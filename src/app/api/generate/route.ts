import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- KHO DỮ LIỆU KHỔNG LỒ (6.25 TRIỆU TỔ HỢP) ---
const hooks = [
  "At Paris Fashion Week,", "Gracing the Dior Autumn Winter 2026 showcase,", "In the heart of the Dior atelier,",
  "Capturing the essence of couture,", "Defining a new sartorial era,", "Commanding the front row in Paris,",
  "A visionary moment unfolds as", "Against the backdrop of Dior's legacy,", "Elevating the seasonal narrative,",
  "Amidst the grandeur of the Dior runway,", "As the lights dim in Paris,", "Marking a definitive fashion milestone,"
];

const actions = [
  "commands", "anchors", "redefines", "manifests", "interprets", "elevates", "captivates", "transforms", 
  "curates", "projects", "sculpts", "articulates", "heralds", "symbolizes", "portrays", "illustrates",
  "reimagines", "orchestrates", "anchors", "defines"
];

const vibes = [
  "architectural", "avant-garde", "ethereal", "minimalist", "quintessential", "visionary", "majestic", 
  "sculptural", "understated", "opulent", "aristocratic", "fluid", "heritage-rich", "transcendental", 
  "modernist", "atelier-crafted", "couture-focused", "boldly-refined", "timelessly-chic"
];

const endings = [
  "A definitive masterclass in style.", "Heritage reimagined for a new generation.", "Sartorial excellence in its purest form.",
  "The pinnacle of contemporary luxury.", "A visionary narrative of craft.", "Pure couture elegance redefined.",
  "The dawn of a new fashion legacy.", "Grace and heritage intertwined.", "A masterpiece of modern tailoring.",
  "Setting the gold standard for luxury."
];

export async function POST() {
  const h = hooks[Math.floor(Math.random() * hooks.length)];
  const a = actions[Math.floor(Math.random() * actions.length)];
  const v = vibes[Math.floor(Math.random() * vibes.length)];
  const e = endings[Math.floor(Math.random() * endings.length)];

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a minimalist fashion editor. Write ONE short, complete sentence only. No storytelling." 
        },
        { 
          role: "user", 
          content: `Task: Create a 25-word caption for LingOrm at Dior AW26. 
          Use exactly this start: "${h}" 
          Include: "${a}", "${v}", and "Dior Brand Ambassadors".
          End with: "${e}"
          Constraint: Must be a COMPLETE sentence. Do not cut off.` 
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7, // Giảm xuống 0.7 để AI bớt "luyên thuyên"
      max_tokens: 80,   // Tăng lên 80 để không bị cắt nửa chừng
      frequency_penalty: 1.0,
    });

    let caption = chatCompletion.choices[0]?.message?.content?.trim() || "";
    
    // Xử lý hậu kỳ: Nếu AI vẫn cố tình viết quá dài hoặc chưa xong (không có dấu chấm cuối)
    if (!caption.endsWith('.') && !caption.endsWith('!')) {
       // Nếu bị cắt cụt, ta dùng luôn câu Fallback cho đẹp
       caption = `${h} LingOrm ${a} a ${v} aesthetic for Dior Autumn Winter 2026 as global Brand Ambassadors. ${e}`;
    }

    return NextResponse.json({ success: true, caption });

  } catch (error) {
    // Logic_Engine (Fallback bất tử)
    const manualCaption = `${h} LingOrm ${a} a ${v} silhouette at Paris Fashion Week for Dior Autumn Winter 2026 as global Brand Ambassadors. ${e}`;
    return NextResponse.json({ success: true, caption: manualCaption });
  }
}