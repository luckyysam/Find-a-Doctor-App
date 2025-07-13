const API_URL = import.meta.env.VITE_API_URL;

export const getAIResponse = async (userInput: string): Promise<string> => {
    // Input validation
  if (!userInput || userInput.trim().length === 0) {
    throw new Error("Please provide a description of your symptoms.");
  }

  // Check for API token
  const apiToken = import.meta.env.VITE_HF_TOKEN;
  if (!apiToken) {
    throw new Error("API configuration error. Please contact support.");
  }


  const payload = {
    model: "google/gemma-2-27b-it",
    messages: [
      {
        role: "system",
        content: "You are a helpful and knowledgeable medical assistant embedded in a healthtech app called 'FaD (Find a Doctor)'. The user will describe how they’re feeling using natural language. Your job is to: Interpret the user’s symptoms in plain language.Suggest 1–3 relevant **medical specialties** (e.g., General Practitioner, Dermatologist, ENT).Explain your reasoning in simple, empathetic terms (2–3 sentences).Format the response clearly with icons or bold headings (for UI rendering).End with a sentence prompting the app to show nearby doctors in those specialties."
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
    return data.choices?.[0]?.message?.content || "No response from AI.";
  } catch (error) {
    console.error(error)
    throw new Error("Failed to get AI response. Please try again.");
  }

}
