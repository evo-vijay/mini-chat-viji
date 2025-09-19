import React, { useRef, useState } from 'react'
import { useEffect } from 'react';

function ChatInput(props) {

    const promptRef = useRef();
    const speechRef = useRef(null);
    const audioRef = useRef(null);
    const [onFocused, setOnFocused] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [openVoiceChat, setOpenVoiceChat] = useState(false);

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {

                setPrompt('');
                promptRef.current.blur();
                if (prompt.length !== 0) {
                    props.handlePromptSubmit(prompt);

                    if (audioRef.current) {
                        audioRef.current.play().catch((err) =>
                            console.error("Sound play failed:", err)
                        );
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [prompt]);

    useEffect(() => {

        if (openVoiceChat) {
            if (window.webkitSpeechRecognition) {




                const SpeechRecognition = window.webkitSpeechRecognition;
                const speech = new SpeechRecognition();
                speech.continuous = true;

                speech.onresult = (event) => {
                    setPrompt(event.results[0][0].transcript);
                    setOpenVoiceChat(false);
                    promptRef.current.focus();

                   


                };

                speech.onend = () => {
                    setOpenVoiceChat(false);
                };

                speech.onerror = (event) => {
                    if (event.error === 'not-allowed') {
                        alert('You need to allow microphone access to use voice chat.');
                    }
                };

                speech.start();
                speechRef.current = speech;
            }
        } else {
            if (speechRef.current) {
                speechRef.current.stop();
                speechRef.current = null;
            }
        }

    }, [openVoiceChat])


    const _handleChangePrompt = (event) => {
        let value = event.target.value;
        setPrompt(value);
    };

    const _handleValidatePrompt = () => {
        if (prompt.length !== 0) {
            props.handlePromptSubmit(prompt);
            setPrompt('');
            promptRef.current.blur();

            if (audioRef.current) {
                audioRef.current.play().catch((err) =>
                    console.error("Sound play failed:", err)
                );
            }

        }
    };

    const _handleRecordVoice = () => {
        setOpenVoiceChat(prev_state => !prev_state);
    };



    return (
        <div className={`${onFocused ? "focus" : ""} chat-input mt-auto`}>

            <input ref={promptRef} type="text" placeholder='Ask me something, eagerly waiting for you...' value={prompt} onChange={_handleChangePrompt} onFocus={() => setOnFocused(true)} onBlur={() => setOnFocused(false)} />

            {/* Voice Icon */}
            <span className={`${openVoiceChat ? "active" : ''} material-symbols-outlined voice-icon cursor-pointer p-1`} onClick={_handleRecordVoice}>
                settings_voice
            </span>

            {/* Submit button */}
            <span className="material-symbols-outlined submit-icon cursor-pointer p-1" onClick={_handleValidatePrompt}>
                arrow_shape_up_stack
            </span>

            <audio className='opacity-0 pe-none' ref={audioRef} src="/message-sound.mp3" preload="auto" />


        </div>
    )
}

export default ChatInput