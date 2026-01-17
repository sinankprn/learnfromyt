import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import "dotenv/config";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is missing. Check .env in server directory");
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Enhanced Zod schema for comprehensive, course-quality study materials
const StudyMaterialsSchema = z.object({
  title: z.string(),
  description: z.string(),
  transcriptSummary: z.string(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(
    z.object({
      id: z.number(),
      objective: z.string()
    })
  ).min(2).max(6),
  sections: z.array(
    z.object({
      title: z.string(),
      objectiveId: z.number(),
      subsections: z.array(
        z.object({
          heading: z.string(),
          content: z.string(),
          examples: z.array(z.string()).optional()
        })
      ).min(1),
      technicalTerms: z.array(
        z.object({
          term: z.string(),
          definition: z.string()
        })
      ).optional(),
      keyPoints: z.array(z.string()).min(2).max(6),
      commonMisconceptions: z.array(z.string()).optional(),
      practicalApplications: z.array(z.string()).optional()
    })
  ).min(2),
  keyTakeaways: z.array(z.string()).min(3).max(8),
  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().min(0).max(3),
      explanation: z.string()
    })
  ).min(3).max(8)
});

// Native Gemini schema (enhanced for comprehensive course content)
const geminiSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "An engaging, descriptive title for the study materials"
    },
    description: {
      type: Type.STRING,
      description: "A comprehensive overview of what will be covered in these materials"
    },
    transcriptSummary: {
      type: Type.STRING,
      description: "A thorough summary capturing all major points from the video transcript"
    },
    prerequisites: {
      type: Type.ARRAY,
      description: "Optional list of concepts or knowledge the learner should have before starting",
      items: {
        type: Type.STRING
      }
    },
    learningObjectives: {
      type: Type.ARRAY,
      description: "Clear, measurable learning objectives (2-6 items) covering all major concepts",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.NUMBER,
            description: "Unique identifier starting from 1"
          },
          objective: {
            type: Type.STRING,
            description: "What the learner will be able to understand, explain, or do after studying"
          }
        },
        required: ["id", "objective"]
      }
    },
    sections: {
      type: Type.ARRAY,
      description: "Comprehensive study sections covering ALL major topics from the video (minimum 2, but create as many as needed)",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Descriptive section title"
          },
          objectiveId: {
            type: Type.NUMBER,
            description: "The ID of the learning objective this section addresses"
          },
          subsections: {
            type: Type.ARRAY,
            description: "Break down complex topics into subsections (minimum 1). Use multiple subsections for detailed topics, single subsection for simpler concepts.",
            items: {
              type: Type.OBJECT,
              properties: {
                heading: {
                  type: Type.STRING,
                  description: "Subsection heading"
                },
                content: {
                  type: Type.STRING,
                  description: "Detailed, thorough explanation with definitions, step-by-step processes, and clarifications. Write as if teaching a student."
                },
                examples: {
                  type: Type.ARRAY,
                  description: "Practical examples, analogies, or use cases to illustrate the concept",
                  items: {
                    type: Type.STRING
                  }
                }
              },
              required: ["heading", "content"]
            }
          },
          technicalTerms: {
            type: Type.ARRAY,
            description: "Important technical terms or jargon used in this section with clear definitions",
            items: {
              type: Type.OBJECT,
              properties: {
                term: {
                  type: Type.STRING,
                  description: "The technical term"
                },
                definition: {
                  type: Type.STRING,
                  description: "Clear, accessible definition"
                }
              },
              required: ["term", "definition"]
            }
          },
          keyPoints: {
            type: Type.ARRAY,
            description: "Essential takeaways from this section (2-6 items)",
            items: {
              type: Type.STRING
            }
          },
          commonMisconceptions: {
            type: Type.ARRAY,
            description: "Common mistakes or misunderstandings students might have about this topic",
            items: {
              type: Type.STRING
            }
          },
          practicalApplications: {
            type: Type.ARRAY,
            description: "Real-world applications or situations where this knowledge is useful",
            items: {
              type: Type.STRING
            }
          }
        },
        required: ["title", "objectiveId", "subsections", "keyPoints"]
      }
    },
    keyTakeaways: {
      type: Type.ARRAY,
      description: "Overall key takeaways from the entire video - the most important concepts to remember (3-8 items)",
      items: {
        type: Type.STRING
      }
    },
    quiz: {
      type: Type.ARRAY,
      description: "Multiple choice quiz questions testing understanding of key concepts (3-8 questions)",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "A question testing conceptual understanding, not just recall"
          },
          options: {
            type: Type.ARRAY,
            description: "Four plausible answer options",
            items: {
              type: Type.STRING
            }
          },
          correctIndex: {
            type: Type.NUMBER,
            description: "Index of the correct answer (0-3)"
          },
          explanation: {
            type: Type.STRING,
            description: "Clear explanation of why this answer is correct and others are not"
          }
        },
        required: ["question", "options", "correctIndex", "explanation"]
      }
    }
  },
  required: ["title", "description", "transcriptSummary", "learningObjectives", "sections", "keyTakeaways", "quiz"]
};

const STUDY_MATERIALS_PROMPT = `You are an expert educational content creator specializing in creating comprehensive, university-quality study materials from video content.

Your goal is to transform this video transcript into COMPLETE, DETAILED learning materials that cover ALL major concepts discussed, not just high-level summaries. Think of this as creating a full course module or professional training material.

CRITICAL INSTRUCTIONS:

1. COMPREHENSIVE COVERAGE:
   - Identify and cover EVERY major concept, topic, and idea mentioned in the video
   - If a concept is briefly mentioned, EXPAND it into a full explanation
   - Don't skip topics just because they're mentioned quickly
   - Create as many sections as needed to cover all concepts thoroughly

2. DEPTH AND DETAIL:
   - Write detailed explanations as if teaching a student who is encountering this material for the first time
   - Define ALL technical terms and jargon
   - Explain processes step-by-step
   - Use clear, educational language
   - Include the "why" and "how", not just the "what"

3. STRUCTURE:
   - Create 2-6 clear learning objectives that cover all major topics
   - Organize content into logical sections (minimum 2, but create more if needed)
   - Break complex sections into multiple subsections (simple topics can have 1 subsection)
   - Each section should thoroughly address one learning objective

4. EDUCATIONAL ENHANCEMENTS:
   - Define technical terms with clear, accessible definitions
   - Provide multiple practical examples and analogies to illustrate concepts
   - Identify common misconceptions students might have
   - Explain real-world applications and use cases
   - List key takeaways for each section

5. ACCURACY:
   - Base ALL content STRICTLY on what is discussed in the video
   - DO NOT introduce concepts, examples, or information not supported by the transcript
   - If the video mentions prerequisites or foundational concepts, include them
   - Stay faithful to the speaker's explanations and examples

6. QUALITY STANDARDS:
   - Write at the quality level of university lecture notes or professional training materials
   - Be thorough - err on the side of more detail rather than less
   - Make the content self-contained so a student could learn from it independently
   - Ensure quiz questions test deep understanding, not just memorization

7. FINAL SUMMARY:
   - Create comprehensive key takeaways (3-8 items) summarizing the MOST important concepts from the entire video

Remember: Your goal is to create COMPLETE educational content that a student could use to fully learn the material, not just review it. Every concept mentioned in the video should be explained thoroughly.

Output must strictly match the provided JSON schema.`;

export async function generateStudyMaterials(youtubeUrl) {
  console.log("Generating study materials for:", youtubeUrl);

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
            text: STUDY_MATERIALS_PROMPT
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
    } catch (parseError) {
      console.error("JSON parse error:", text?.substring(0, 200));
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}`);
    }

    // Validate with Zod
    const validated = StudyMaterialsSchema.parse(parsed);

    // Count subsections for logging
    const totalSubsections = validated.sections.reduce((acc, section) => acc + section.subsections.length, 0);
    console.log("Successfully validated comprehensive study materials:");
    console.log(" - Sections:", validated.sections.length);
    console.log(" - Total subsections:", totalSubsections);
    console.log(" - Quiz questions:", validated.quiz.length);
    console.log(" - Key takeaways:", validated.keyTakeaways.length);

    return validated;
  } catch (error) {
    console.error("Study materials generation error:");
    console.error(" - Message:", error.message);
    if (error.stack) console.error(" - Stack:", error.stack);
    throw error;
  }
}
