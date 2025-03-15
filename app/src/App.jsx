import React, { useState } from "react";
import axios from "axios";
import Login from "./Login";

const App = () => {
    const [text, setText] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("es"); // Default to Spanish
    const [translation, setTranslation] = useState("");
    const [source, setSource] = useState("");

    const handleTranslate = async () => {
        if (!text.trim()) {
            alert("Please enter text to translate.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/translate", {
                text,
                targetLanguage,
            });

            setTranslation(response.data.translation);
            setSource(response.data.source);
        } catch (error) {
            console.error("Translation failed:", error);
            alert("Translation request failed.");
        }
    };

    return (
        <div style={styles.container}>
            <h1>🌍 Text Translator</h1>
            <textarea
                style={styles.textarea}
                rows="4"
                placeholder="Enter text to translate..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <select style={styles.select} value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
                <option value="zh">Chinese</option>
            </select>
            <button style={styles.button} onClick={handleTranslate}>Translate</button>
            {translation && (
                <div style={styles.result}>
                    <h3>Translation ({targetLanguage.toUpperCase()}):</h3>
                    <p>{translation}</p>
                    <p><small>Source: {source}</small></p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px", fontFamily: "Arial" },
    textarea: { width: "80%", padding: "10px", fontSize: "16px" },
    select: { margin: "10px", padding: "5px", fontSize: "16px" },
    button: { padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none" },
    result: { marginTop: "20px", padding: "10px", border: "1px solid #ddd", display: "inline-block", textAlign: "left" },
};

export default App;
