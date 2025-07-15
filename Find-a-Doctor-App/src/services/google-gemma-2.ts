import { type AIResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const getAIResponse = async (userInput: string): Promise<AIResponse> => {
  // Input validation
  if (!userInput || userInput.trim().length === 0) {
    throw new Error("Please provide a description of your symptoms.");
  }

  // Check for API token
  const apiToken = import.meta.env.VITE_HF_TOKEN;
  if (!apiToken) {
    throw new Error("API configuration error. Please contact support.");
  }

  const systemPrompt = `
    You are a helpful and knowledgeable medical assistant embedded in a healthtech app called "FaD (Find a Doctor)".

    The user will describe how they’re feeling using natural language.

    Your job is to:

    1. Interpret the user's symptoms in plain language.
    2. Suggest 1–3 relevant **medical specialties** (e.g., General Practitioner, Dermatologist, ENT).
    3. Explain your reasoning in a simple, empathetic tone (2–3 sentences).
    4. Format the response clearly with icons or bold markdown headings (for UI rendering).
    5. End with a sentence prompting the app to show nearby doctors.

    ❗ Important:
    - **Do not** give a diagnosis.
    - Never recommend medication or treatment.
    - If unsure, default to **General Practitioner**.
    - Keep the language human and friendly.

    Return your full message in natural markdown format for UI, but at the end, include a JSON object like:

    \`\`\`json
    {
      "specialties": ["Orthopedist", "Sports Medicine Doctor"]
    }
    \`\`\`

    Only include the JSON object at the end. This allows the system to extract structured data while keeping the UI friendly and helpful.
    `;


  const payload = {
    model: "google/gemma-2-27b-it",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userInput.trim(),
      },
    ],
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const fullContent = data.choices?.[0]?.message?.content || "No response from AI.";

    // Extract JSON block from message
    const jsonMatch = fullContent.match(/```json([\s\S]*?)```/);
    let specialties: string[] = [];

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        specialties = parsed.specialties || [];
        console.log(specialties)
      } catch (err) {
        console.error("Failed to parse specialties JSON:", err);
      }
    }

    // Remove JSON from message for display
    const textWithoutJson = fullContent.replace(/```json[\s\S]*?```/, "").trim();

    return {
      text: textWithoutJson,
      specialties,
    };

    // return data.choices?.[0]?.message?.content || "No response from AI.";
  } catch (error) {
    console.error(error)
    throw new Error("Failed to get AI response. Please try again.");
  }

}
