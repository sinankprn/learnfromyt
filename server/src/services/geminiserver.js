import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import "dotenv/config";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is missing. dotenv not loaded?");
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const transcriptionSchema = z.object({
  text: z.string(),
});

const learningMaterialSchema = z.object({
  summary: z.object({
    thesis: z.string(),
    keyPoints: z.array(z.string()).min(3).max(5),
  }),

  sections: z.array(
    z.object({
      title: z.string(),
      keyIdea: z.string(),
      explanation: z.string(),
      examples: z.array(z.string()).default([]),
    })
  ),

  keyConcepts: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
    })
  ),

  reviewQuestions: z.array(
    z.object({
      type: z.enum(["recall", "conceptual", "applied"]),
      question: z.string(),
      answer: z.string(),
    })
  ),
});

async function transcribeAudio(youtubeUrl) {
  const prompt =
    "Transcribe this audio file word-for-word. Do not summarize the segments; provide the full verbatim text.";
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          fileData: {
            fileUri: youtubeUrl,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      temperature: 0.0,
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(transcriptionSchema),
    },
  });

  return JSON.parse(response.text);
}

export async function generateLearningMaterial(youtubeUrl) {
  const transcription = await transcribeAudio(youtubeUrl);

  const learningPrompt = `
You are an expert educator.

Using the following verbatim transcript, generate structured learning material.
Do NOT invent information. Base everything strictly on the transcript.

Transcript:
"""
${transcription.text}
"""
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [{ text: learningPrompt }],
    },
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(learningMaterialSchema),
    },
  });

  return JSON.parse(response.text);
}
