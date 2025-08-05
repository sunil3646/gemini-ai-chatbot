// server.js
import 'dotenv/config'; // Modern way to load dotenv
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Import node-fetch


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: 'https://gemini-ai-chat-bot.netlify.app'
};
app.use(cors(corsOptions));// Allow requests from your frontend
app.use(express.json()); // Parse JSON bodies

// Securely get your new API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// API endpoint to handle the Gemini request
app.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            throw new Error("Failed to generate response from Gemini API.");
        }

        const data = await response.json();
        res.json(data); // Send the response from Gemini back to the frontend
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/', (req, res) => {
  res.send('Server is running and listening for requests!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});