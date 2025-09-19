
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
  }
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
      let data = response.text.replace(/\*+/g, "");;

      console.log(response);

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
    <div className="container-fluid min-vh-100 px-0 d-flex flex-column">
      <div className="row mx-0 w-100 mb-2">
        <div className="col-12 px-0">
          <Header />
        </div>
      </div>

      <div className="row flex-fill mb-1">
        <div className="col-12 col-sm-10 col-lg-8 mx-auto">
          <div className="chat-window py-2 d-flex flex-column">

            <audio id="audio-element" src="./assets/message-sound.mp3" autoPlay></audio>

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
