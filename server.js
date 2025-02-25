require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files (assuming they are in a "public" folder)
app.use(express.static(path.join(__dirname, "public")));

// Root route to prevent "Cannot GET /" errors
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API route to generate an image
app.post('/generate-image', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            { inputs: req.body.prompt },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );
        
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
