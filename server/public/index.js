var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import * as dotenv from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertMeditationSchema: () => insertMeditationSchema,
  meditations: () => meditations,
  meditationsRelations: () => meditationsRelations,
  updateMeditationSchema: () => updateMeditationSchema
});
import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var meditations = pgTable("meditations", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  content: text("content"),
  //remove not null
  rating: integer("rating"),
  // Rating from 1-5
  model: text("model"),
  // Make sure this exists
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
var meditationsRelations = relations(meditations, ({ many }) => ({}));
var insertMeditationSchema = createInsertSchema(meditations).pick({ prompt: true, model: true }).extend({
  prompt: z.string().min(1, "Please enter a meditation prompt"),
  model: z.string().optional()
  // Make it optional
});
var updateMeditationSchema = createInsertSchema(meditations).pick({ rating: true }).extend({
  rating: z.number().min(1).max(5)
});

// server/db.ts
dotenv.config();
if (process.env.NODE_ENV === "production") {
  try {
    import("ws").then((wsModule) => {
      neonConfig.webSocketConstructor = wsModule.default || wsModule;
      console.log("WebSocket module loaded successfully for Neon database");
    }).catch((err) => {
      console.error("Failed to load WebSocket module:", err);
      neonConfig.useSecureWebSocket = false;
    });
  } catch (error) {
    console.error("Error setting up WebSocket:", error);
    neonConfig.useSecureWebSocket = false;
  }
} else {
  console.log("Development mode: Not using WebSockets");
  neonConfig.useSecureWebSocket = false;
  neonConfig.webSocketConstructor = void 0;
}
var DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}
var pool;
try {
  pool = new Pool({ connectionString: DATABASE_URL });
  console.log("Database pool created successfully");
} catch (error) {
  console.error("Failed to create database pool:", error);
  throw error;
}
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var lastGeneratedMeditation = null;
var DatabaseStorage = class {
  // Create a new meditation
  async createMeditation(meditation) {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log("[MOCK] Creating meditation:", meditation.prompt);
        lastGeneratedMeditation = {
          id: Date.now(),
          // Use timestamp for unique ID
          prompt: meditation.prompt,
          content: meditation.content,
          // Store the actual generated content
          rating: null,
          model: meditation.model || "llama3-70b-8192",
          // Add default model
          createdAt: /* @__PURE__ */ new Date()
        };
        return lastGeneratedMeditation;
      }
      const [newMeditation] = await db.insert(meditations).values(meditation).returning();
      return newMeditation;
    } catch (error) {
      console.error("Database error details:", {
        message: error?.message || "No message",
        code: error?.code || "No code",
        detail: error?.detail || "No detail",
        sqlState: error?.sqlState || "No sqlState",
        query: error?.query || "No query",
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      });
      throw error;
    }
  }
  // Get a specific meditation by ID
  async getMeditation(id) {
    if (process.env.NODE_ENV === "development") {
      console.log("[MOCK] Getting meditation:", id);
      if (lastGeneratedMeditation) {
        return lastGeneratedMeditation;
      }
      return {
        id,
        prompt: "Mock prompt",
        content: "This is a mock meditation content for development.",
        rating: null,
        model: "llama3-70b-8192",
        // Add default model
        createdAt: /* @__PURE__ */ new Date()
      };
    }
    const [meditation] = await db.select().from(meditations).where(eq(meditations.id, id));
    return meditation;
  }
  // List all meditations
  async listMeditations() {
    if (process.env.NODE_ENV === "development") {
      console.log("[MOCK] Listing meditations");
      const mockMeditations = [{
        id: 1,
        prompt: "Mock prompt",
        content: "This is a mock meditation content for development.",
        rating: null,
        model: "llama3-70b-8192",
        // Add default model
        createdAt: new Date(Date.now() - 864e5)
        // 1 day ago
      }];
      if (lastGeneratedMeditation) {
        mockMeditations.unshift(lastGeneratedMeditation);
      }
      return mockMeditations;
    }
    return db.select().from(meditations).orderBy(meditations.createdAt);
  }
  // Rate a meditation
  async rateMeditation(id, rating) {
    if (process.env.NODE_ENV === "development") {
      console.log("[MOCK] Rating meditation:", id, rating);
      return {
        id,
        prompt: "Mock prompt",
        content: "This is a mock meditation content for development.",
        rating,
        model: "llama3-70b-8192",
        // Add default model
        createdAt: /* @__PURE__ */ new Date()
      };
    }
    const [updated] = await db.update(meditations).set({ rating }).where(eq(meditations.id, id)).returning();
    return updated;
  }
  // Delete a meditation
  async deleteMeditation(id) {
    if (process.env.NODE_ENV === "development") {
      console.log("[MOCK] Deleting meditation:", id);
      return;
    }
    await db.delete(meditations).where(eq(meditations.id, id));
  }
  // Update meditation content
  async updateMeditationContent(id, content) {
    if (process.env.NODE_ENV === "development") {
      console.log("[MOCK] Updating meditation content:", id);
      if (lastGeneratedMeditation && lastGeneratedMeditation.id === id) {
        lastGeneratedMeditation.content = content;
        return lastGeneratedMeditation;
      }
      return {
        id,
        prompt: "Mock prompt",
        content,
        rating: null,
        model: "llama3-70b-8192",
        // Add default model
        createdAt: /* @__PURE__ */ new Date()
      };
    }
    const [updated] = await db.update(meditations).set({ content }).where(eq(meditations.id, id)).returning();
    return updated;
  }
};
var storage = new DatabaseStorage();

// server/groq.ts
import { Groq } from "groq-sdk";
var groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com"
  // Removed /openai/v1 from baseURL
});
async function listModels() {
  if (!groq) {
    console.error("Groq client not initialized due to missing API key.");
    return [];
  }
  try {
    const models = await groq.models.list();
    return models.data || [];
  } catch (error) {
    console.error("Error listing Groq models:", error);
    return [];
  }
}
async function generateMeditation(prompt, model = "llama3-70b-8192") {
  try {
    console.log(`Starting meditation generation for prompt: "${prompt}" using model: ${model}`);
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `You are a meditation guide creating scripts to be read aloud. 
            Follow these guidelines:
            1. Provide ONLY the verbatim script that would be read aloud during the meditation
            2. DO NOT include introductions, titles, notes, metadata, or durations
            3. DO NOT use markdown formatting, asterisks, or other special characters
            4. DO NOT number steps or sections
            5. Use natural pauses in the text with line breaks where appropriate
            6. Begin directly with the meditation guidance (e.g., "Close your eyes...", "Take a deep breath...")
            7. Use plain, clear language designed for speaking
            8. Avoid any text that isn't meant to be read aloud
            
            Your response should be the exact text a narrator would read, without any additional content.`
          },
          {
            role: "user",
            content: `Create a meditation script based on this prompt: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    console.log(`Generated meditation with ${content.length} characters`);
    const duration = Math.round(content.length / 15);
    return { content, duration };
  } catch (error) {
    console.error("Meditation generation error:", error);
    throw new Error(`Failed to generate meditation: ${error.message || "Unknown error"}`);
  }
}
console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "Not set");

// server/elevenlabs.ts
import fetch2 from "node-fetch";
function cleanupTextForAudio(text2) {
  let cleanText = text2.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/#{1,6}\s+/g, "").replace(/```[^`]*```/g, "").replace(/^Title:.*$/gm, "").replace(/^Meditation:.*$/gm, "").replace(/^Script:.*$/gm, "");
  const lines = cleanText.split("\n");
  const cleanedLines = lines.filter((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return false;
    if (trimmedLine.match(/^(Title|Duration|Tags|Author|Category):/i)) return false;
    return true;
  }).map((line) => line.trim());
  return cleanedLines.join("\n");
}
async function synthesizeSpeech(text2, voiceId) {
  const cleanedText = cleanupTextForAudio(text2);
  if (process.env.ELEVENLABS_API_KEY && !voiceId.startsWith("openai_") && !voiceId.startsWith("groq_") && !voiceId.startsWith("playai_")) {
    try {
      console.log("Attempting ElevenLabs TTS...");
      return await synthesizeWithElevenLabs(cleanedText, voiceId);
    } catch (error) {
      console.error("ElevenLabs TTS failed:", error);
    }
  }
  if (process.env.OPENAI_API_KEY && (!voiceId.startsWith("groq_") && !voiceId.startsWith("playai_") || voiceId.startsWith("openai_"))) {
    const openaiVoiceId = voiceId.startsWith("openai_") ? voiceId.replace("openai_", "") : mapElevenLabsToOpenAI(voiceId);
    try {
      console.log("Attempting OpenAI TTS...");
      return await synthesizeWithOpenAI(cleanedText, openaiVoiceId);
    } catch (error) {
      console.error("OpenAI TTS failed:", error);
    }
  }
  if (process.env.GROQ_API_KEY && (!voiceId.startsWith("playai_") || voiceId.startsWith("groq_"))) {
    const groqModel = voiceId.startsWith("groq_") ? voiceId.replace("groq_", "") : "playai-tts-arabic";
    try {
      console.log("Attempting Groq TTS...");
      return await synthesizeWithGroq(cleanedText, groqModel);
    } catch (error) {
      console.error("Groq TTS failed:", error);
    }
  }
  if (process.env.PLAYAI_API_KEY) {
    const playaiVoiceId = voiceId.startsWith("playai_") ? voiceId.replace("playai_", "") : "en-US-Female-1";
    try {
      console.log("Attempting PlayAI TTS...");
      return await synthesizeWithPlayAI(cleanedText, playaiVoiceId);
    } catch (error) {
      console.error("PlayAI TTS failed:", error);
    }
  }
  throw new Error("No TTS service available or all services failed");
}
async function synthesizeWithElevenLabs(text2, voiceId) {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }
  const MAX_CHUNK_SIZE = 4e3;
  const textChunks = [];
  for (let i = 0; i < text2.length; i += MAX_CHUNK_SIZE) {
    textChunks.push(text2.substring(i, i + MAX_CHUNK_SIZE));
  }
  console.log(`Synthesizing speech with ElevenLabs: ${textChunks.length} chunks`);
  let allAudioBuffers = [];
  for (let i = 0; i < textChunks.length; i++) {
    const chunk = textChunks[i];
    console.log(`Processing chunk ${i + 1}/${textChunks.length}, length: ${chunk.length}`);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const response = await fetch2(url, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: chunk,
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }
    const audioBuffer = Buffer.from(await response.arrayBuffer());
    allAudioBuffers.push(audioBuffer);
  }
  if (allAudioBuffers.length === 1) {
    return allAudioBuffers[0];
  }
  return Buffer.concat(allAudioBuffers);
}
async function synthesizeWithOpenAI(text2, voiceId) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const url = "https://api.openai.com/v1/audio/speech";
  const response = await fetch2(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text2,
      voice: voiceId,
      response_format: "mp3"
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}
async function synthesizeWithGroq(text2, model) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  const url = "https://api.groq.com/openai/v1/audio/speech";
  const response = await fetch2(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      // 'playai-tts-arabic' or other Groq TTS model
      input: text2,
      voice: "default",
      // Adjust if Groq offers voice options
      response_format: "mp3"
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errorText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}
async function synthesizeWithPlayAI(text2, voiceId) {
  if (!process.env.PLAYAI_API_KEY) {
    throw new Error("PLAYAI_API_KEY is not configured");
  }
  const url = "https://api.play.ai/api/text-to-speech";
  const requestBody = {
    text: text2,
    voice_id: voiceId,
    model: "playdialog",
    output_format: "mp3"
  };
  if (process.env.PLAYAI_USER_ID) {
    requestBody.user_id = process.env.PLAYAI_USER_ID;
  }
  console.log("PlayAI request:", JSON.stringify(requestBody, null, 2));
  const response = await fetch2(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PLAYAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PlayAI API error: ${response.status} ${errorText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}
function mapElevenLabsToOpenAI(elevenLabsVoiceId) {
  const mapping = {
    "21m00Tcm4TlvDq8ikWAM": "nova",
    // Rachel - female voice
    "AZnzlk1XvdvUeBnXmlld": "alloy",
    // Domi - neutral voice
    "EXAVITQu4vr4xnSDxMaL": "echo",
    // Bella - female voice
    "MF3mGyEYCl7XYWbV9V6O": "onyx",
    // Adam - male voice
    "TxGEqnHWrfWFTfGW9XjX": "shimmer",
    // Josh - male voice
    "VR6AewLTigWG4xSOukaG": "fable",
    // Elli - female voice
    "pNInz6obpgDQGcFmaJgB": "alloy",
    // Antoni - male voice
    "yoZ06aMxZJJ28mfd3POQ": "nova"
    // Sam - female voice
  };
  return mapping[elevenLabsVoiceId] || "alloy";
}
async function listVoices() {
  console.log("Starting listVoices function...");
  let voices = [];
  const defaultVoices = [
    { id: "default", name: "Default Voice" },
    { id: "groq_playai-tts-arabic", name: "Arabic TTS (Groq)" },
    { id: "openai_nova", name: "OpenAI Nova" },
    { id: "21m00Tcm4TlvDq8ikWAM", name: "ElevenLabs Rachel" }
  ];
  console.log("Adding default voices:", defaultVoices.length);
  voices = [...defaultVoices];
  if (process.env.PLAYAI_API_KEY) {
    console.log("PlayAI API key found, attempting to fetch voices...");
    try {
      const userIdParam = process.env.PLAYAI_USER_ID ? `?user_id=${process.env.PLAYAI_USER_ID}` : "";
      const response = await fetch2(`https://api.play.ai/api/voices${userIdParam}`, {
        headers: {
          "Authorization": `Bearer ${process.env.PLAYAI_API_KEY}`
        }
      });
      console.log("PlayAI API response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("PlayAI data received, has voices:", !!data.voices);
        if (data.voices && Array.isArray(data.voices)) {
          const playaiVoices = data.voices.map((voice) => ({
            id: `playai_${voice.voice_id}`,
            name: `PlayAI ${voice.name}`
          }));
          console.log(`Found ${playaiVoices.length} PlayAI voices`);
          voices.push(...playaiVoices);
        }
      } else {
        const playaiVoices = [
          { id: "playai_en-US-Female-1", name: "PlayAI English Female 1" },
          { id: "playai_en-US-Male-1", name: "PlayAI English Male 1" },
          { id: "playai_ar-SA-Female-1", name: "PlayAI Arabic Female 1" },
          { id: "playai_ar-SA-Male-1", name: "PlayAI Arabic Male 1" }
        ];
        voices.push(...playaiVoices);
        console.log("Added static PlayAI voices:", playaiVoices.length);
      }
    } catch (error) {
      console.error("Network error fetching PlayAI voices:", error);
      const playaiVoices = [
        { id: "playai_en-US-Female-1", name: "PlayAI English Female 1" },
        { id: "playai_en-US-Male-1", name: "PlayAI English Male 1" },
        { id: "playai_ar-SA-Female-1", name: "PlayAI Arabic Female 1" },
        { id: "playai_ar-SA-Male-1", name: "PlayAI Arabic Male 1" }
      ];
      voices.push(...playaiVoices);
      console.log("Added static PlayAI voices after error:", playaiVoices.length);
    }
  }
  if (process.env.ELEVENLABS_API_KEY) {
    console.log("ElevenLabs API key found, attempting to fetch voices...");
    try {
      const response = await fetch2("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY
        }
      });
      console.log("ElevenLabs API response status:", response.status);
      if (response.ok) {
        const responseText = await response.text();
        console.log("ElevenLabs response received, length:", responseText.length);
        try {
          const data = JSON.parse(responseText);
          console.log("ElevenLabs data parsed, has voices:", !!data.voices);
          if (data.voices && Array.isArray(data.voices)) {
            const elevenLabsVoices = data.voices.map((voice) => ({
              id: voice.voice_id,
              name: voice.name
            }));
            console.log(`Found ${elevenLabsVoices.length} ElevenLabs voices`);
            voices.push(...elevenLabsVoices);
          } else {
            console.error("ElevenLabs response structure unexpected:", data);
          }
        } catch (parseError) {
          console.error("Failed to parse ElevenLabs response:", parseError);
        }
      } else {
        console.error("Failed to fetch ElevenLabs voices:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Network error fetching ElevenLabs voices:", error);
    }
  } else {
    console.log("ElevenLabs API key not configured");
  }
  if (process.env.OPENAI_API_KEY) {
    console.log("OpenAI API key found, adding static voice list");
    const openaiVoices = [
      { id: "openai_alloy", name: "OpenAI Alloy" },
      { id: "openai_echo", name: "OpenAI Echo" },
      { id: "openai_fable", name: "OpenAI Fable" },
      { id: "openai_onyx", name: "OpenAI Onyx" },
      { id: "openai_nova", name: "OpenAI Nova" },
      { id: "openai_shimmer", name: "OpenAI Shimmer" }
    ];
    voices.push(...openaiVoices);
    console.log(`Added ${openaiVoices.length} OpenAI voices`);
  } else {
    console.log("OpenAI API key not configured");
  }
  if (process.env.GROQ_API_KEY) {
    console.log("Groq API key found, adding static voice list");
    const groqVoices = [
      { id: "groq_playai-tts-arabic", name: "Arabic TTS (Groq)" },
      { id: "groq_playai-tts-1", name: "Standard TTS (Groq)" }
    ];
    voices.push(...groqVoices);
    console.log(`Added ${groqVoices.length} Groq voices`);
  } else {
    console.log("Groq API key not configured");
  }
  console.log(`Total voices available: ${voices.length}`);
  const uniqueVoices = Array.from(
    new Map(voices.map((voice) => [voice.id, voice])).values()
  );
  console.log(`After deduplication: ${uniqueVoices.length} voices`);
  return uniqueVoices;
}

// server/routes.ts
import { ZodError } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/models", async (_req, res) => {
    try {
      const models = await listModels();
      res.json(models.map((model) => model.id));
    } catch (error) {
      console.error("Failed to list models:", error);
      res.status(500).json({ error: "Failed to list models" });
    }
  });
  app2.get("/api/voices", async (_req, res) => {
    try {
      const voicesData = await listVoices();
      res.json(voicesData);
    } catch (error) {
      console.error("Failed to fetch voices:", error);
      res.status(500).json({ error: "Failed to fetch voices" });
    }
  });
  app2.get("/api/meditations/:id/audio", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const voiceId = req.query.voice_id;
      if (!voiceId) {
        return res.status(400).json({ error: "Voice ID is required" });
      }
      const meditation = await storage.getMeditation(id);
      if (!meditation || !meditation.content) {
        return res.status(404).json({ error: "Meditation content not found" });
      }
      const audioBuffer = await synthesizeSpeech(meditation.content, voiceId);
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length,
        "Cache-Control": "no-cache",
        "Content-Disposition": "inline"
      });
      res.send(audioBuffer);
    } catch (error) {
      console.error("Failed to generate audio:", error);
      res.status(500).json({ error: "Failed to generate audio" });
    }
  });
  app2.post("/api/meditations", async (req, res) => {
    try {
      const { prompt, model } = req.body;
      console.log("Received meditation prompt:", prompt, "with model:", model);
      console.log("Generating meditation...");
      let generated;
      try {
        generated = await generateMeditation(prompt, model);
        console.log("Generated meditation content successfully, length:", generated.content.length);
      } catch (genError) {
        console.error("Specific generation error:", genError);
        console.error("Error stack:", genError.stack);
        throw genError;
      }
      console.log("Truncating content if needed...");
      const maxContentLength = 1e4;
      const truncatedContent = generated.content.length > maxContentLength ? generated.content.substring(0, maxContentLength - 3) + "..." : generated.content;
      console.log("Content ready for database, truncated:", generated.content.length > maxContentLength);
      console.log("Saving to database...");
      const meditation = await storage.createMeditation({
        prompt,
        content: truncatedContent,
        model
      });
      console.log("Saved to database, ID:", meditation.id);
      res.json({ ...meditation, duration: generated.duration });
    } catch (error) {
      console.error("FULL ERROR DETAILS:");
      console.error("Error type:", typeof error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error stringified:", JSON.stringify(error, null, 2));
      res.status(500).json({
        error: "Failed to create meditation",
        details: error?.message || "Unknown error"
      });
    }
  });
  app2.get("/api/meditations", async (_req, res) => {
    try {
      const meditations2 = await storage.listMeditations();
      res.json(meditations2);
    } catch (error) {
      console.error("Failed to list meditations:", error);
      res.status(500).json({ error: "Failed to list meditations" });
    }
  });
  app2.get("/api/meditations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const meditation = await storage.getMeditation(id);
      if (!meditation) {
        return res.status(404).json({ error: "Meditation not found" });
      }
      res.json(meditation);
    } catch (error) {
      console.error("Failed to fetch meditation:", error);
      res.status(500).json({ error: "Failed to fetch meditation" });
    }
  });
  app2.patch("/api/meditations/:id/rate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const { rating } = updateMeditationSchema.parse(req.body);
      const meditation = await storage.rateMeditation(id, rating);
      res.json(meditation);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Failed to rate meditation:", error);
        res.status(500).json({ error: "Failed to rate meditation" });
      }
    }
  });
  app2.delete("/api/meditations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteMeditation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete meditation:", error);
      res.status(500).json({ error: "Failed to delete meditation" });
    }
  });
  app2.get("/api/test", (req, res) => {
    res.json({ status: "ok", message: "Server is working" });
  });
  app2.get("/api/groq-test", async (req, res) => {
    console.log("==== GROQ TEST ENDPOINT CALLED ====");
    try {
      console.log("Testing Groq connection...");
      console.log("GROQ_API_KEY set:", process.env.GROQ_API_KEY ? "Yes (length: " + process.env.GROQ_API_KEY.length + ")" : "No");
      try {
        console.log("Testing basic fetch to Groq API...");
        const response = await fetch("https://api.groq.com/openai/v1/models", {
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        });
        console.log("Fetch status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Basic fetch successful, models count:", data.data?.length || 0);
        } else {
          console.log("Basic fetch failed:", response.statusText);
        }
      } catch (fetchError) {
        console.error("Basic fetch error:", fetchError);
      }
      console.log("Trying listModels function...");
      const models = await listModels();
      console.log("listModels returned:", models);
      res.json({
        status: "ok",
        message: "Groq connection successful",
        models
      });
      console.log("==== GROQ TEST ENDPOINT COMPLETED SUCCESSFULLY ====");
    } catch (error) {
      console.error("==== GROQ TEST ERROR ====");
      console.error("Groq test error:", error);
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      res.status(500).json({
        status: "error",
        message: "Groq connection failed",
        error: error?.message || String(error)
      });
    }
  });
  app2.get("/api/db-test", async (req, res) => {
    console.log("==== DB TEST ENDPOINT CALLED ====");
    try {
      const testPrompt = "Test prompt for debugging";
      const testContent = "Short test content to verify database operations";
      console.log("Creating test meditation...");
      const created = await storage.createMeditation({
        prompt: testPrompt,
        content: testContent
      });
      console.log("Test meditation created:", created);
      const retrieved = await storage.getMeditation(created.id);
      console.log("Test meditation retrieved:", retrieved);
      await storage.deleteMeditation(created.id);
      console.log("Test meditation deleted");
      res.json({
        status: "ok",
        message: "Database operations successful"
      });
    } catch (error) {
      console.error("==== DB TEST ERROR ====");
      console.error("DB test error:", error);
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      res.status(500).json({
        status: "error",
        message: "Database test failed",
        error: error?.message || String(error)
      });
    }
  });
  app2.patch("/api/meditations/:id/content", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const { content } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }
      const meditation = await storage.updateMeditationContent(id, content);
      res.json(meditation);
    } catch (error) {
      console.error("Failed to update meditation content:", error);
      res.status(500).json({ error: "Failed to update meditation content" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react(), runtimeErrorOverlay(), themePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
