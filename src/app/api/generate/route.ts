import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Only use keys that exist in env. GROQ_KEYS="key1,key2,..." or GROQ_KEY_1..GROQ_KEY_N (e.g. 444 keys). Vercel pro + Redis Pay as You Go + Llama: performance and cache okay.
let CACHED_GROQ_KEYS: string[] | null = null;
function getGroqKeys(): string[] {
  if (CACHED_GROQ_KEYS) return CACHED_GROQ_KEYS;
  
  const keys: string[] = [];
  const env = process.env;
  
  Object.keys(env).forEach((key) => {
    if (key.startsWith("GROQ_KEY_")) {
      const val = env[key];
      if (val && val.trim().length > 0) keys.push(val.trim());
    }
  });
  
  CACHED_GROQ_KEYS = keys;
  return keys;
}
const GROQ_KEYS = getGroqKeys();

// Cache RAM nội bộ (Giảm tải cho Redis và Groq)
type CacheEntry = { caption: string; ts: number };
const responseCache = new Map<string, CacheEntry>();
const inFlightAi = new Map<string, Promise<string>>();

const hooks = [
  "At Paris Fashion Week,", "Gracing the Dior AW26 showcase,", "In the heart of the Dior atelier,", "Commanding the front row in Paris,", "Defining a new sartorial era,", 
  "Amidst the grandeur of Dior,", "Captured in the essence of Paris,", "Elevating the seasonal narrative,", "A visionary moment unfolds as,", "Against the backdrop of heritage,",
  "Within the prestigious halls,", "Under the Parisian skylights,", "Stepping into the Dior spotlight,", "Embodying the spirit of Avenue Montaigne,", "A historic fashion milestone as,",
  "Amidst the buzz of the front row,", "Witnessing a couture evolution,", "As the lights dim at Dior,", "Redefining the modern runway,", "In a display of pure elegance,",
  "Charting a new course in style,", "At the peak of the fashion season,", "In the legendary world of Dior,", "Refining the art of presence,", "A definitive fashion statement as,",
  "Through the lens of high fashion,", "In the sanctuary of craftsmanship,", "Honoring Dior’s timeless legacy,", "Beyond the velvet ropes of Paris,", "A new chapter in luxury begins as,",
  "In the golden hour of couture,", "Setting the global style agenda,", "At the intersection of art and fashion,", "Immersed in Dior’s winter dreams,", "A majestic presence felt as,",
  "Leading the way in Parisian chic,", "In the epicenter of the avant-garde,", "Under the gaze of the fashion elite,", "Reflecting on Dior’s storied past,", "Shaping the future of the runway,",
  "In a symphony of silk and structure,", "Amidst the whispers of the atelier,", "A triumph of creative vision as,", "Poised in the heart of the city,", "A luminous appearance made as,",
  "Navigating the realms of luxury,", "On the grand stage of Paris,", "Captivating the fashion world as,", "In the timeless embrace of Dior,", "A modern icon emerges as,"
];

const actions = [
  "redefines", "manifests", "anchors", "elevates", "transforms", "portrays", "projects", "sculpts", "interprets", "articulates",
  "crystallizes", "heralds", "symbolizes", "illustrates", "orchestrates", "reimagines", "captivates", "commands", "embodies", "showcases",
  "curates", "amplifies", "perfects", "evokes", "radiates", "defines", "inspires", "navigates", "envisions", "shapes",
  "boldly presents", "gracefully leads", "masterfully craft", "instinctively anchors", "poetically reflects", "effortlessly frames", "artistically portrays", "vividly captures", "timelessly evokes", "seamlessly blends",
  "anchors the gaze with", "shines through", "navigates through", "dominates the scene with", "breathes life into", "commands attention with", "carefully sculpts", "elegantly manifests", "powerfully projects", "subtly redefines"
];

const vibes_shared = [
  "architectural", "avant-garde", "ethereal", "minimalist", "quintessential", "visionary", "majestic", "sculptural", "understated", "opulent",
  "aristocratic", "fluid", "heritage-rich", "transcendental", "modernist", "atelier-crafted", "boldly-refined", "timelessly-chic", "high-fashion", "couture-focused",
  "sophisticated", "distinctly Dior", "powerfully feminine", "elegantly structured", "seamlessly tailored", "vibrant", "monochromatic", "luminous", "dynamic",
  "haute-couture", "revolutionary", "strikingly poised", "exquisitely balanced", "effortlessly cool", "sartorial", "unapologetic", "captivating", "dreamlike", "meticulous",
  "sharply-cut", "lavishly-detailed", "uniquely-crafted", "historically-inspired", "radically-chic", "sublimely-elegant", "highly-curated", "deeply-emotive", "grand", "poetic"
];

const vibes_ling = ["statuesque", "serene", "regal", "ethereal yet bold", "heavenly", "classically poised"];
const vibes_orm = ["edgy", "radiant", "magnetizing", "avant-modern", "electric", "boldly expressive"];

const endings = [
  "A masterclass in style.", "Heritage reimagined.", "Pure couture elegance.", "The gold standard of luxury.", "A visionary narrative of craft.", "The dawn of a new legacy.",
  "Sartorial excellence defined.", "Grace and heritage intertwined.", "A masterpiece of modern tailoring.", "Setting the standard for luxury.", "An unforgettable couture moment.",
  "The height of contemporary chic.", "Sophistication in its truest form.", "A legacy in the making.", "The pinnacle of Parisian style.", "Couture at its finest.",
  "A bold step forward.", "The essence of Dior captured.", "Defining the winter aesthetic.", "Luxury without compromise.", "A true style revolution.",
  "Where heritage meets the future.", "A poetic vision in motion.", "The ultimate fashion statement.", "Crafted to perfection.", "Elegance that resonates.",
  "The new era of Dior.", "Simply iconic.", "A study in Parisian grace.", "Reshaping the fashion landscape.", "The soul of the atelier.",
  "Beyond the reach of time.", "A symphony of style.", "Pure sartorial magic.", "Dior’s winter masterpiece.", "In a league of its own.",
  "Chic beyond measure.", "The art of being LingOrm.", "Parisian dreams fulfilled.", "A flawless execution of style.", "High fashion’s latest triumph.",
  "Exquisite from every angle.", "The talk of Paris.", "Style that speaks volumes.", "A couture dream realized.", "Refining the modern wardrobe.",
  "Iconic in every sense.", "The winter season’s crowning glory.", "A timeless tribute to craft.", "The future of Dior looks bright."
];  

// --- Performance & survival config ---
// Tuned for Vercel Pro + Upstash pay-as-you-go and batch generation.
const CACHE_MAX_SIZE = 8000; // reserved for future RAM caching strategies
const CACHE_TTL_MS = 8000;
const REDIS_WRITE_PROB = 0.02;
const AI_TIMEOUT_MS = 3500; // 3.5s per attempt; up to 3 attempts under high load
const REDIS_TIMEOUT_MS = 400;
const PRUNE_PROBABILITY = 0.1;

function pruneCache() {
  if (responseCache.size <= CACHE_MAX_SIZE) return;
  const sorted = [...responseCache.entries()].sort((a, b) => a[1].ts - b[1].ts);
  const toDelete = sorted.length - Math.floor(CACHE_MAX_SIZE * 0.8);
  for (let i = 0; i < toDelete && i < sorted.length; i++) {
    responseCache.delete(sorted[i][0]);
  }
}

function getIdentity(category: string | null): { name: string; vibe: string[]; isDuo: boolean } {
  const c = (category || "lingorm").toLowerCase();
  if (c === "ling") return { name: "Lingling Kwong", vibe: [...vibes_shared, ...vibes_ling], isDuo: false };
  if (c === "orm") return { name: "Orm Kornnaphat", vibe: [...vibes_shared, ...vibes_orm], isDuo: false };
  return { name: "LingOrm", vibe: vibes_shared, isDuo: true };
}

export async function POST(request: NextRequest) {
  const now = Date.now();
  const category = request.nextUrl?.searchParams?.get("category") ?? "lingorm";
  const { name, vibe, isDuo } = getIdentity(category);

  const makeOneFallback = () => {
    const h = hooks[Math.floor(Math.random() * hooks.length)];
    const v = vibe[Math.floor(Math.random() * vibe.length)];
    const eRaw = endings[Math.floor(Math.random() * endings.length)];
    const e = eRaw.replace(/LingOrm/g, name);
    return `${h} ${name} ${isDuo ? "redefine" : "redefines"} a ${v} silhouette for Dior AW26. ${e}`;
  };

  const makeFallbackBatch = () => [makeOneFallback(), makeOneFallback(), makeOneFallback(), makeOneFallback()];

  if (GROQ_KEYS.length === 0) return NextResponse.json({ captions: makeFallbackBatch(), source: "FALLBACK" });

  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const randomSeed = Math.random().toString(36).slice(2, 8);

    try {
      const randomKey = GROQ_KEYS[Math.floor(Math.random() * GROQ_KEYS.length)];
      const groq = new Groq({ apiKey: randomKey });

      const aiPromise = groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `Fashion Editor. Return ONLY JSON: {"captions": ["s1", "s2", "s3", "s4"]}
            Event: Dior AW26 Paris. Subject: ${name} (Ambassador).
            Rules:
            - Exactly 4 sentences.
            - Length per sentence: 85-125 characters.
            - MUST start with "${name}".
            - Verbs: ${isDuo ? "Plural" : "Singular"}.
            - No runway, no models. High-fashion style.
            - Variation: ${randomSeed}.`
          },
          { role: "user", content: `Generate 4 captions for ${name} at Dior AW26.` }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.9,
        max_tokens: 400, // Tăng lên để tránh bị cắt nửa chừng
        response_format: { type: "json_object" } // Ép Groq trả JSON chuẩn
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), 4500) // Tăng lên 4.5s cho chắc
      );

      const completion = await Promise.race([aiPromise, timeoutPromise]);
      const raw = completion.choices[0]?.message?.content?.trim();

      if (!raw) continue;

      let parsed: any = JSON.parse(raw);
      let captions = parsed.captions || [];

      // Nới lỏng kiểm tra để giảm tỉ lệ Fallback, chỉ cần câu có độ dài hợp lý là duyệt
      const validCaptions = captions.filter((s: any) => 
        typeof s === "string" && s.length >= 70 && s.length <= 150
      );

      if (validCaptions.length >= 1) { // Nếu có ít nhất 1 câu xịn thì dùng luôn, thiếu thì bù bằng fallback
        let finalCaptions = validCaptions.slice(0, 4);
        while (finalCaptions.length < 4) {
          finalCaptions.push(makeOneFallback());
        }

        if (redis) {
          redis.set(`batch:${category}:${now}`, finalCaptions, { ex: 3600 }).catch(() => {});
        }

        const response = NextResponse.json({ captions: finalCaptions, source: "AI" });
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
        return response;
      }
    } catch (err: any) {
      console.warn(`Attempt ${attempt + 1} failed: ${err.message}`);
      if (attempt === maxAttempts - 1) break;
    }
  }

  return NextResponse.json({ captions: makeFallbackBatch(), source: "FALLBACK" });
}