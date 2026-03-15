import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
})

const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash",
  "gemini-1.5-pro"
]

/**
 * Highly stable call to Groq (Free Tier backup).
 */
async function generateWithGroq(prompt) {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
  if (!apiKey || apiKey.includes("YOUR_GROQ_KEY")) return null

  try {
    console.log("[Support] Trying Groq (llama-3.3-70b-versatile)...")
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    })

    const data = await resp.json()
    if (!resp.ok) throw new Error(data?.error?.message || "Groq Error")

    return data.choices[0].message.content
  } catch (e) {
    console.warn("[Groq Fail]", e.message)
    return null
  }
}

/**
 * Final fallback using raw Gemini REST calls.
 */
async function generateWithGeminiRest(model, prompt) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    const data = await resp.json()
    if (!resp.ok) throw new Error(data?.error?.message || `HTTP ${resp.status}`)

    return data?.candidates?.[0]?.content?.parts?.[0]?.text
  } catch (e) {
    throw e
  }
}

/**
 * Main entry point. Prioritizes Groq if available, then rotates Gemini.
 */
export async function generateInterview(prompt) {
  console.log("--- Resilient AI Generation Start ---")

  // 1. Try Groq first (Recommended for Free Tier)
  const groqResult = await generateWithGroq(prompt)
  if (groqResult) {
    console.log("[Success] Generated via Groq")
    return groqResult
  }

  // 2. Fallback to Gemini Rotation
  let lastError = null
  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[Gemini] Trying ${model}...`)
      
      // Try SDK
      try {
        const response = await genAI.models.generateContent({
          model: model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        })
        const text = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) return text
      } catch (sdkErr) {
        console.warn(`[SDK Fail] ${model}. Trying REST...`)
      }

      // Try REST
      const restText = await generateWithGeminiRest(model, prompt)
      if (restText) return restText

    } catch (err) {
      lastError = err
      console.warn(`[Model Fail] ${model}: ${err.message}`)
      continue
    }
  }

  console.error("--- TOTAL FAILURE ---")
  throw new Error("All free AI models are currently exhausted. Please add a GROQ API KEY to continue for free today.")
}