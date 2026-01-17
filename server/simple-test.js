import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is missing");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function test() {
    console.log("Starting simple connectivity test...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ role: "user", parts: [{ text: "Say hello and confirm you can see this." }] }],
        });

        const text = typeof response.text === 'function' ? response.text() : response.text;
        console.log("Response from Gemini:", text);
        process.exit(0);
    } catch (err) {
        console.error("Simple test failed:", err);
        process.exit(1);
    }
}

test();
