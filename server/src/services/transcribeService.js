import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import "dotenv/config";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is missing. Check .env in server directory");
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Zod schema for validation
const TranscriptSchema = z.object({
  summary: z.string(),
  segments: z.array(
    z.object({
      timestamp: z.string(), // MM:SS
      speaker: z.string(),
      text: z.string(),
      language: z.string(),
      language_code: z.string()
    })
  )
});

// Native Gemini schema format
const geminiSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the entire video content"
    },
    segments: {
      type: Type.ARRAY,
      description: "List of transcribed segments with speaker and timestamp",
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: {
            type: Type.STRING,
            description: "Timestamp in MM:SS format"
          },
          speaker: {
            type: Type.STRING,
            description: "Speaker identifier (e.g., Speaker 1, Speaker 2, or name if known)"
          },
          text: {
            type: Type.STRING,
            description: "The spoken text for this segment"
          },
          language: {
            type: Type.STRING,
            description: "The language name (e.g., English, Spanish)"
          },
          language_code: {
            type: Type.STRING,
            description: "The language code (e.g., en, es)"
          }
        },
        required: ["timestamp", "speaker", "text", "language", "language_code"]
      }
    }
  },
  required: ["summary", "segments"]
};

// Exact prompt as specified in requirements
const TRANSCRIPTION_PROMPT = `You are a transcription engine.

Transcribe the ENTIRE audio from the provided YouTube video.

Rules:
- Do not summarize or omit content
- Preserve spoken wording as accurately as possible
- Split content into logical segments
- Include timestamps

Output must strictly match the provided JSON schema.
Do not include commentary or markdown.`;

export async function transcribeYouTubeVideo(youtubeUrl) {
  console.log("Transcribing YouTube video:", youtubeUrl);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            fileData: {
              fileUri: youtubeUrl
            }
          },
          {
            text: TRANSCRIPTION_PROMPT
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: geminiSchema
      }
    });

    const text = typeof response.text === "function" ? response.text() : response.text;
    console.log("Raw Gemini response length:", text?.length || 0);

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(text);
      console.log("Parsed response structure:", JSON.stringify(parsed, null, 2).substring(0, 500));
      console.log("Response is array?", Array.isArray(parsed));
      console.log("Response keys:", Object.keys(parsed || {}));
    } catch (parseError) {
      console.error("JSON parse error:", text?.substring(0, 200));
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}`);
    }

    // Validate with Zod
    const validated = TranscriptSchema.parse(parsed);
    console.log("Successfully validated transcript with", validated.segments.length, "segments");

    return validated;
  } catch (error) {
    console.error("Transcription error:");
    console.error(" - Message:", error.message);
    if (error.stack) console.error(" - Stack:", error.stack);
    throw error;
  }
}
