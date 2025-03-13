const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Translation Route
app.post("/translate", async (req, res) => {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
        return res.status(400).json({ error: "Text and target language are required" });
    }
    
    try {
        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2`,
            {},
            {
                params: {
                    q: text,
                    target: targetLanguage,
                    key: process.env.GOOGLE_API_KEY,
                },
            }
        );
        
        res.json({ translation: response.data.data.translations[0].translatedText });
    } catch (error) {
        res.status(500).json({ error: "Translation failed", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});