import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Only use keys that exist in env. GROQ_KEYS="key1,key2,..." or GROQ_KEY_1..GROQ_KEY_N (e.g. 444 keys). Vercel free + Redis + Llama: performance and cache okay.
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
// Designed to survive high read traffic on free/low tiers by leaning on RAM cache and very light Redis writes.
const CACHE_MAX_SIZE = 8000; // limit number of captions in RAM
const CACHE_TTL_MS = 8000; // 8 seconds RAM cache to prevent spam but still rotate captions quickly
const REDIS_WRITE_PROB = 0.02; // only ~2% of hits write to Redis to protect Upstash free
const AI_TIMEOUT_MS = 1800; // 1.8s timeout so Vercel instances free quickly under load
const REDIS_TIMEOUT_MS = 400; // max 0.4s waiting for Redis before falling back
const PRUNE_PROBABILITY = 0.1; // run prune ~10% of writes → less CPU, cache still bounded

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
  const { name, isDuo } = getIdentity(category);

  // 1. Force a fresh cache key on every click so AI runs again
  const randomSalt = Math.floor(Math.random() * 1000);
  const cacheKey = `${category}_${randomSalt}`;

  // 2. If we have Groq keys, call AI directly (no Redis read)
  if (GROQ_KEYS.length > 0) {
    const randomKey = GROQ_KEYS[Math.floor(Math.random() * GROQ_KEYS.length)];
    const groq = new Groq({ apiKey: randomKey });
    const aiSeed = Math.random().toString(36).slice(2, 7);

    try {
      const aiPromise = groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `Vogue Fashion Editor. 
            Event: Dior Autumn Winter 2026 (AW26) show in Paris.
            Subject: ${name} (Dior Brand Ambassador).
            
            STRICT WRITING RULES:
            1. Subject MUST be "${name}".
            2. Status: Dior Brand Ambassador.
            3. No "models", no "runway", no "walking", no "they show", no "designs".
            4. Length: 75-105 characters (Must be > 25 chars).
            5. Vocabulary: Use "Paris", "Dior AW26", "chic", "silhouette", "ambassador".
            6. Grammar: Correct English. No double subjects like "Name they show".` 
          },
          { role: "user", content: `Write one iconic sentence for Dior Brand Ambassador ${name} at the AW26 show.` }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.95,
        max_tokens: 45,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), AI_TIMEOUT_MS)
      );

      const completion = await Promise.race([aiPromise, timeoutPromise]);
      const aiResult = completion.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g, "");

      if (aiResult && aiResult.length > 20) {
        // Short-lived RAM cache entry (mainly for protection if multiple requests share the same randomSalt accidentally)
        responseCache.set(cacheKey, { caption: aiResult, ts: now });

        // Log to Redis as history only (never read back for content)
        if (redis) {
          redis.set(`log:${category}:${now}`, aiResult, { ex: 3600 }).catch(() => {});
        }

        const response = NextResponse.json({ 
          success: true, 
          caption: aiResult, 
          source: "AI",
          debug: aiSeed,
        });

        // Make sure no CDN/browser cache freezes the text
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");

        return response;
      }
    } catch {
      // Groq error or timeout → fall through to fallback
    }
  }

  // 3. Random fallback when AI fails
  const fallback = `${name} ${isDuo ? "redefine" : "redefines"} Dior's AW26 vision with a ${
    vibes_shared[Math.floor(Math.random() * vibes_shared.length)]
  } presence.`;

  return NextResponse.json({ success: true, caption: fallback, source: "FALLBACK" });
}