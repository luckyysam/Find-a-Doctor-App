import React, { useRef, useState, type FormEvent, useEffect } from "react";
import { getAIResponse } from "../services/google-gemma-2";
import HealthcareProviderSearch from "./Search";
import { type AIResponse } from "../types";
import paperPlaneRight from '../assets/paper-plane-right.svg'
const SymptomInput = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIResponse | null >(null);

  const forminputRef = useRef<HTMLDivElement>(null)
  const aiResponseRef = useRef<HTMLDivElement>(null)



  useEffect(() => {

    if (!forminputRef.current && !aiResponseRef.current) return;

    if (result) {
      forminputRef.current?.classList.add('remove')
      aiResponseRef.current?.classList.add('show')
    }

  }, [result])


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const aiResponse = await getAIResponse(inputValue);
    setResult(aiResponse);  
    setLoading(false);
  };



  return (
    <div className="chat-container">

      <div className="form-container" ref={forminputRef}>
        <form 
          onSubmit={handleSubmit} 
          className="user-input"
        >
          <input
            className="symptom-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your symptoms..."
            required />
          <button type="submit" disabled={loading} className="">
            {loading ? "Analyzing..." : "Send"}
          </button>
        </form>

      </div>


      <div className="ai-response" ref={aiResponseRef}>
        <div className="user-s">
          <p>{inputValue}</p>
        </div>

        <div className="ai-resp">
          <p>{result?.text}</p>
        </div>

        <div className="user-message-bottom">
          <div className="message-wrapper">
            <form action="">
              <input type="text" placeholder="any Question ?"  className="user-message"/>
            </form>

            <img src={paperPlaneRight} alt=" send button" />
          </div>

        </div>

      </div>

      {result &&  <HealthcareProviderSearch specialty={result.specialties[0]}/>}


    </div>
  );
};

export default SymptomInput;
