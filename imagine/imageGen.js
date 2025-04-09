import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates images using Google's Gemini AI
 * 
 * @param {string} prompt - Text description of the image to generate
 * @param {number} numberOfImages - Number of images to generate (1-4)
 * @param {string} aspectRatio - Aspect ratio (e.g. '1:1', '16:9', '4:3', '9:16')
 * @returns {Promise<Object>} - Object containing generated images
 */
export async function generateImage(prompt, numberOfImages = 1, aspectRatio = "1:1") {
  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: prompt,
    config: {
      numberOfImages: numberOfImages,
      aspectRatio: aspectRatio,
    },
  });
  return response;
}
