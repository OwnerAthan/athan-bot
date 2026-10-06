import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Pesan tidak boleh kosong."
      });
    }

    const response = await client.responses.create({
      model: "gpt-6-luna",
      instructions: `
Kamu adalah Athan BOT.

Nama kamu adalah Athan BOT.
Kamu adalah AI assistant yang ramah, pintar, santai, dan membantu.
Jawablah dalam bahasa Indonesia kecuali pengguna meminta bahasa lain.
Bantu pengguna dengan pemrograman, Roblox, teknologi, dan pertanyaan umum.
Jangan mengaku sebagai manusia.
      `,
      input: message
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Athan BOT sedang mengalami masalah."
    });
  }
});

app.listen(port, () => {
  console.log(`Athan BOT berjalan di port ${port}`);
});
