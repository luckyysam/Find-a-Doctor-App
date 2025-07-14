import React, { useState, type FormEvent } from "react";
import { getAIResponse } from "../services/google-gemma-2";
import HealthcareProviderSearch from "./Search";
import { type AIResponse } from "../types";

const SymptomInput = () => {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIResponse | null >(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const aiResponse = await getAIResponse(input);
    setResult(aiResponse);  
    setLoading(false);
  };

  return (
    <><form onSubmit={handleSubmit} className="">
      <input
        className=""
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your symptoms..."
        required />
      <button type="submit" disabled={loading} className="">
        {loading ? "Analyzing..." : "Find a Doctor"}
      </button>
    </form>


     {/* Display AI Response */}
     {result && (
      <>
      <h1>AI Response</h1>
      <h2>{result.text}</h2>
      <HealthcareProviderSearch specialty={result.specialties[0]}/>

      </>
     )}

    </>
  );
};

export default SymptomInput;
