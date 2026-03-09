import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Redis } from "@upstash/redis";
import {
  hooks,
  actions_singular,
  actions_plural,
  vibes_shared,
  vibes_ling,
  vibes_orm,
  endings,
} from "./constants";

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

type CacheEntry = { caption: string; ts: number };
const responseCache = new Map<string, CacheEntry>();

// --- Performance & survival config ---
// Tuned for Vercel Pro + Upstash pay-as-you-go and batch generation.
const CACHE_MAX_SIZE = 8000; // reserved for future RAM caching strategies

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
  
    const actionPool = isDuo ? actions_plural : actions_singular;
    const a = actionPool[Math.floor(Math.random() * actionPool.length)];
  
    return `${h} ${name} ${a} a ${v} vision for Dior AW26. ${e}`;
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
            content: `Vogue Fashion Editor. 
            Task: Write 4 UNIQUE, high-end luxury captions for ${name} at the Dior AW26 show in Paris.
            Style: Use sophisticated sartorial vocabulary (e.g., atelier, savoir-faire, silhouette, heritage, architectural, quintessence).
            
            Rules:
            - Return ONLY JSON: {"captions": ["s1", "s2", "s3", "s4"]}
            - Each sentence MUST start with "${name}".
            - Exactly 4 distinct sentences.
            - Character count per sentence: 85-125 characters.
            - Verbs: ${isDuo ? "Plural (are/embody/redefine)" : "Singular (is/embodies/redefines)"}.
            - Atmosphere: Front-row brand ambassador, quiet luxury, cinematic poise.
            - Strictly NO: "models", "runway", "walking", hashtags, or commentary text.
            - Variation Token: ${randomSeed}.`
          },
          { role: "user", content: `Generate 4 captions for ${name} at Dior AW26.` }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.9,
        max_tokens: 400,
        response_format: { type: "json_object" }
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), 4500)
      );

      const completion = await Promise.race([aiPromise, timeoutPromise]);
      const raw = completion.choices[0]?.message?.content?.trim();

      if (!raw) continue;

      let parsed: any = JSON.parse(raw);
      let captions = parsed.captions || [];
      const validCaptions = captions.filter((s: any) => 
        typeof s === "string" && s.length >= 80 && s.length <= 150
      );

      if (validCaptions.length >= 1) {
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