import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
};

// Initialize Firebase AI
const app = initializeApp(firebaseConfig);
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Helper to create a model instance
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

export const generateReview = async (
  prompt: string
): Promise<string | null> => {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "model",
          parts: [
            {
              text: `
                Text only as reply.
              `,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `
                You are an AI agent.
              `,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    return result.response.text();
  } catch (error) {
    console.error("Error generating review:", error);
    return null;
  }
};
