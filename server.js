const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ This is the route definition you were missing
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    console.error("❌ No message received in request body.");
    return res.status(400).json({ error: "No message provided." });
  }

  try {
    const chat = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful AI assistant that can speak Hindi and English." },
        { role: "user", content: userMessage }
      ]
    });

    const reply = chat.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      console.error("❌ No reply received from OpenAI:", chat);
      return res.status(500).json({ error: "No response from AI." });
    }

    console.log("✅ AI replied:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("❌ OpenAI API error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Something went wrong with OpenAI." });
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
