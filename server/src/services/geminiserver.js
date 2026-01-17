import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import "dotenv/config";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is missing. check .env in server directory");
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Define the schema using Zod
const courseSchema = z.object({
  title: z.string().describe("An engaging title for the course"),
  description: z.string().describe("A brief summary of the course content"),
  transcriptSummary: z.string().describe("A concise summary of the key points transcribed from the audio"),
  learningObjectives: z.array(
    z.object({
      id: z.number().describe("Unique identifier starting from 1"),
      objective: z.string().describe("What the learner will be able to do"),
    })
  ).min(2).max(5),
  sections: z.array(
    z.object({
      title: z.string().describe("Section title"),
      objectiveId: z.number().describe("The id of the objective this section maps to"),
      content: z.string().describe("Detailed educational material"),
      keyPoints: z.array(z.string()).min(2).max(4).describe("Key takeaways"),
      example: z.string().optional().describe("A practical example"),
    })
  ).min(2),
  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().min(0).max(3),
      explanation: z.string(),
    })
  ).min(3).max(6),
});

export async function generateLearningMaterial(youtubeUrl) {
  console.log("Generating course using audio understanding for:", youtubeUrl);

  const prompt = `
    1. Transcribe the audio from this video carefully.
    2. Based on that transcription, generate a high-quality, structured learning course.
    3. Include a 'transcriptSummary' that captures the core message of the audio.
    4. Ensure all learning objectives, sections, and quiz questions are strictly based on the transcribed content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                fileUri: youtubeUrl,
                mimeType: "video/mp4"
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(courseSchema),
      },
    });

    const text = typeof response.text === 'function' ? response.text() : response.text;
    console.log("Raw Gemini Response text length:", text?.length || 0);

    // AI sometimes wraps JSON in markdown code blocks
    const cleanJson = (str) => {
      const match = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      return match ? match[1] : str;
    };

    const sanitizedText = cleanJson(text);
    let result;
    try {
      result = JSON.parse(sanitizedText);
    } catch (parseError) {
      console.error("JSON PARSE ERROR on text snippet:", sanitizedText.substring(0, 100) + "...");
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}`);
    }

    console.log("Successfully parsed course data.");
    return result;
  } catch (error) {
    console.error("CRITICAL Gemini Generation Error:");
    console.error(" - Message:", error.message);
    if (error.stack) console.error(" - Stack:", error.stack);
    throw error;
  }
}
