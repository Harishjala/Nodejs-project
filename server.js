const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "mysql",
    database: process.env.DB_NAME || "translation_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test Database Connection
app.get("/test-db", async (req, res) => {
    try {
        const [results] = await db.query("SELECT 1");
        res.json({ message: "✅ Database is connected!" });
    } catch (err) {
        console.error("❌ Database test query failed:", err);
        res.status(500).json({ error: "Database not connected" });
    }
});
app.get("/translations", async (req, res) => {
    try {
        const [translations] = await db.query("SELECT * FROM translations");
        res.json(translations);
    } catch (error) {
        console.error("Error fetching translations:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});


// Translation Route
app.post("/translate", async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({ error: "Both text and target language are required." });
        }

        if (!process.env.GOOGLE_API_KEY) {
            return res.status(500).json({ error: "Missing Google API Key in environment variables." });
        }

        // Check if translation exists in database
        const [existingTranslation] = await db.query(
            "SELECT translated_text FROM translations WHERE text = ? AND target_language = ?",
            [text, targetLanguage]
        );

        if (existingTranslation.length > 0) {
            return res.json({ translation: existingTranslation[0].translated_text, source: "database" });
        }

        // Fetch translation from Google API
        const apiUrl = "https://translation.googleapis.com/language/translate/v2";
        const response = await axios.post(apiUrl, {}, {
            params: {
                q: text,
                target: targetLanguage,
                key: process.env.GOOGLE_API_KEY,
            },
        });

        const translation = response.data?.data?.translations?.[0]?.translatedText;
        if (!translation) {
            throw new Error("Translation response format unexpected.");
        }

        // Save translation to database
        await db.query(
            "INSERT INTO translations (text, translated_text, target_language) VALUES (?, ?, ?)",
            [text, translation, targetLanguage]
        );

        res.json({ translation, source: "API" });
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({
            error: "Translation failed",
            details: error.response?.data?.error?.message || error.message,
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on("error", (err) => {
    console.error("❌ Server failed to start:", err.message);
});
