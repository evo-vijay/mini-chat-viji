
import { useEffect, useRef, useState } from "react";

// Google Gemini AI Package import
import { GoogleGenAI } from "@google/genai";


import ChatContent from "./components/chat-content";
import ChatInput from "./components/chat-input";
import Header from "./components/header";
import "./style.css";

const CHAT_HISTORY = [
  {
    role: "bot",
    text: "Hi How are you doing ?"
  },
];


const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

function App() {

  const audioRef = useRef(null);
  const [chatHistory, setChatHistory] = useState(CHAT_HISTORY);

  const _handlePromptSubmit = (prompt) => {

    let chat_history = [
      ...chatHistory,
      {
        role: "user",
        text: prompt
      },
    ];

    setChatHistory(chat_history);

    setTimeout(() => {
      setChatHistory(prev_history => (
        [
          ...prev_history,
          {
            role: "bot",
            text: "I'm thinking 🤔 ...."
          }
        ]
      ));
    }, 500);

    const audio = new Audio("/message-sound.mp3");
    audio.play().catch((err) => console.error("Sound play failed:", err));

    // Creating thinking state 
    setTimeout(() => {
      _generateAIResponse(prompt, chat_history);
    }, 500);


  };


  // AI API call - To get AI Response
  const _generateAIResponse = async (prompt, chat_history) => {

    try {


      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0, // Disables thinking
          },
        }
      });
      let data = response.text.replace(/\*+/g, "");

      setChatHistory(
        [
          ...chat_history,
          {
            role: "bot",
            text: data
          }
        ]
      );

    } catch (error) {
      setChatHistory(
        [
          ...chat_history,
          {
            role: "bot",
            text: "I am stuck somewhere sorry ☹️"
          }
        ]
      );
    }

    if (audioRef.current) {
      audioRef.current.play().catch((err) =>
        console.error("Sound play failed:", err)
      );
    }
  }

  return (
    <div className="container-fluid">
      <div className="row vh-100vh flex-wrap">
        <div className="col-12  col-lg-3 px-0 ">
          <Header />
        </div>

        <div className="col-12 col-lg-9 py-2 h-100">
          <div className="chat-window">
            <ChatContent chatHistory={chatHistory} />
            <ChatInput handlePromptSubmit={_handlePromptSubmit} />
            <audio ref={audioRef} src="/message-sound.mp3" preload="auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
