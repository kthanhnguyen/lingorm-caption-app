import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Only use keys that exist in env. GROQ_KEYS="key1,key2,..." or GROQ_KEY_1..GROQ_KEY_N (e.g. 444 keys). Vercel free + Redis + Llama: performance and cache okay.
function getGroqKeys(): string[] {
  const fromList = process.env.GROQ_KEYS;
  if (fromList && typeof fromList === "string") {
    return fromList
      .split(",")
      .map((k) => k.trim())
      .filter((k): k is string => typeof k === "string" && k.length > 0);
  }
  const keys: string[] = [];
  for (let i = 1; i <= 500; i++) {
    const v = process.env[`GROQ_KEY_${i}`];
    if (typeof v === "string" && v.trim().length > 0) keys.push(v.trim());
  }
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

const vibes = [
  "architectural", "avant-garde", "ethereal", "minimalist", "quintessential", "visionary", "majestic", "sculptural", "understated", "opulent",
  "aristocratic", "fluid", "heritage-rich", "transcendental", "modernist", "atelier-crafted", "boldly-refined", "timelessly-chic", "high-fashion", "couture-focused",
  "sophisticated", "ethereal yet bold", "distinctly Dior", "powerfully feminine", "elegantly structured", "seamlessly tailored", "vibrant", "monochromatic", "luminous", "dynamic",
  "haute-couture", "revolutionary", "strikingly poised", "exquisitely balanced", "effortlessly cool", "sartorial", "unapologetic", "captivating", "dreamlike", "meticulous",
  "sharply-cut", "lavishly-detailed", "uniquely-crafted", "historically-inspired", "radically-chic", "sublimely-elegant", "highly-curated", "deeply-emotive", "grand", "poetic"
];

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

// --- Performance for high concurrency ---
// Groq ~30 RPM per key. N keys → ~30*N RPM. We try 2 keys per request then fallback.
// Scale note: 2000 concurrent → Vercel burst ~1000/10s (rest may 503); 1M req/day → need paid Vercel + paid Redis (free: ~1M invocations/month, ~500k Redis commands/month).
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min
const CACHE_MAX_SIZE = 5000; // larger = more RAM hits, fewer Redis/Groq at 1M/day
const MAX_KEYS_TO_TRY = 2; // Try at most 2 keys then fallback → bounded latency
const PRUNE_PROBABILITY = 0.1; // only run prune ~10% of writes → less CPU, cache still bounded

function pruneCache() {
  if (responseCache.size <= CACHE_MAX_SIZE) return;
  const sorted = [...responseCache.entries()].sort((a, b) => a[1].ts - b[1].ts);
  const toDelete = sorted.length - Math.floor(CACHE_MAX_SIZE * 0.8);
  for (let i = 0; i < toDelete && i < sorted.length; i++) {
    responseCache.delete(sorted[i][0]);
  }
}

export async function POST() {
  const now = Date.now();

  // 1. Create fallback sentence (Speed 0ms)
  const h = hooks[Math.floor(Math.random() * hooks.length)];
  const a = actions[Math.floor(Math.random() * actions.length)];
  const v = vibes[Math.floor(Math.random() * vibes.length)];
  const e = endings[Math.floor(Math.random() * endings.length)];
  const seedText = `${h} LingOrm ${a} a ${v} silhouette for Dior Autumn Winter 2026. ${e}`;

  // 2. Check Cache RAM (Speed 0ms)
  const ramCached = responseCache.get(seedText);
  if (ramCached && now - ramCached.ts < CACHE_TTL_MS) {
    return NextResponse.json({ success: true, caption: ramCached.caption, source: "RAM" });
  }

  // 3. Check Redis (shared cache across Vercel instances)
  if (redis) {
    try {
      const redisVal = await redis.get(seedText);
      if (redisVal && typeof redisVal === "string") {
        responseCache.set(seedText, { caption: redisVal, ts: now });
        return NextResponse.json({ success: true, caption: redisVal, source: "REDIS" });
      }
    } catch {
      // Redis down or rate-limited (Upstash Free): continue to Groq/fallback
    }
  }

  // 4. Call AI only when there is at least 1 key in env (444 keys → use exactly N keys)
  if (GROQ_KEYS.length === 0) {
    if (Math.random() < PRUNE_PROBABILITY) pruneCache();
    responseCache.set(seedText, { caption: seedText, ts: now });
    if (redis) { try { await redis.set(seedText, seedText, { ex: 3600 }); } catch { /* ignore */ } }
    return NextResponse.json({ success: true, caption: seedText, source: "FALLBACK" });
  }

  const shuffledKeys = [...GROQ_KEYS].sort(() => Math.random() - 0.5);
  const keysToTry = shuffledKeys.slice(0, MAX_KEYS_TO_TRY);

  for (const key of keysToTry) {
    if (!key || typeof key !== "string" || key.length === 0) continue;
    try {
      const groq = new Groq({ apiKey: key });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a luxury fashion editor for Vogue. Rewrite the input into ONE elegant English sentence. No hashtags, no quotes. Output ONLY the text." },
          { role: "user", content: `Rewrite: ${seedText}` }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 1.1,
        presence_penalty: 1.8,
      }, { signal: controller.signal });

      clearTimeout(timeoutId);
      const aiResult = completion.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g, '');

      if (aiResult && aiResult.length > 20) {
        if (Math.random() < PRUNE_PROBABILITY) pruneCache();
        responseCache.set(seedText, { caption: aiResult, ts: now });
        if (redis) { try { await redis.set(seedText, aiResult, { ex: 86400 }); } catch { /* ignore */ } }
        return NextResponse.json({ success: true, caption: aiResult, source: "AI" });
      }
    } catch {
      continue;
    }
  }

  // 5. Fallback: cache it so we don't retry Groq for same seed on every request
  if (Math.random() < PRUNE_PROBABILITY) pruneCache();
  responseCache.set(seedText, { caption: seedText, ts: now });
  if (redis) { try { await redis.set(seedText, seedText, { ex: 3600 }); } catch { /* ignore */ } } // 1h for fallback
  return NextResponse.json({ success: true, caption: seedText, source: "FALLBACK" });
}