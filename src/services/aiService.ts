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
                You are an AI agent that reviews sustainable actions. 
                Based on the provided data, you generate a professional assessment 
                and calculate the amount of CO₂ emissions reduced or removed.

                Example:

                Input Data:
                {
                  "actionType": "Tree Planting",
                  "location": "Kaduna, Nigeria",
                  "treesPlanted": 250,
                  "verificationMethod": "Satellite & IoT sensors",
                  "durationMonths": 12
                }

                Expected Review:
                The action involves planting 250 trees in Kaduna, Nigeria, verified using satellite and IoT-based monitoring. 
                Based on regional carbon sequestration rates (approximately 21 kg CO₂ per tree per year), 
                this activity is estimated to reduce around 5.25 metric tons of CO₂ annually. 
                The project demonstrates strong sustainability impact, particularly in restoring degraded land 
                and enhancing local air quality.
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
