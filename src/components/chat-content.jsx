import { useEffect, useRef } from "react";



function ChatContent({ chatHistory }) {


    const chatContentRef = useRef(null);

    useEffect(() => {
        if (chatContentRef.current) {
            const lastChild = chatContentRef.current.lastElementChild;
            if (lastChild) {
                lastChild.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [chatHistory]);

    return (
        <div ref={chatContentRef} className="chat-content flex-fill p-2 d-flex flex-column gap-3  overflow-y-scroll">

            {
                chatHistory.map((item, index) => (
                    item.role === "bot" ?
                        <div className="chat-text-wrapper d-flex gap-2 align-items-center bot-text" key={index}>
                            <span className="material-symbols-outlined chat-bot p-1">
                                robot_2
                            </span>
                            <p className="chat-text">{item.text}</p>
                        </div>
                        :
                        <div className="chat-text-wrapper d-flex gap-2 align-items-center user-text ms-auto" key={index}>
                            <p className="chat-text">{item.text}</p>
                            <span className="material-symbols-outlined user-bot p-1">
                                nest_wake_on_approach
                            </span>
                        </div>
                ))
            }



        </div>
    )
}

export default ChatContent