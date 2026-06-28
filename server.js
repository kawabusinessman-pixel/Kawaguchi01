const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Jalur (Endpoint) untuk menerima chat dari aplikasi HP
app.post('/api/chat', async (req, res) => {
    const { message, characterPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key belum dipasang di server Vercel.' });
    }

    try {
        // Mengirim pesan ke AI Gemini gratisanmu
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: message }] }],
                systemInstruction: { parts: [{ text: characterPrompt || "Kamu adalah karakter anime waifu/husbando." }] }
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Aduh, otak AI karakter kamu sedang error.' });
    }
});

// KUNCI PERBAIKAN: Wajib di-export agar Vercel bisa menjalankan Express
module.exports = app;
