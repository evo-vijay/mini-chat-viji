import { useState } from "react";

export default function Header() {

    const [darkMode, setDarkMode] = useState(false);

    const _handleDarkMode = () => {
        setDarkMode(prev => !prev);

        if (darkMode) {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }
    };


    return (
        <header className="header">
            <h1 className="heading d-flex gap-2 justify-content-center align-items-center">
                <span className="material-symbols-outlined fs-2">
                    robot_2
                </span>
                I'm Chatbot VIJI
            </h1>
            <p className="mb-0">How can I assist you today?</p>

            <span class="dark-mode material-symbols-outlined position-fixed top-0 end-0 m-4 cursor-pointer p-1 bg-dark-subtle" onClick={_handleDarkMode}>
                {darkMode ? "dark_mode" : "light_mode"}
            </span>
        </header>
    );
}


