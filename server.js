import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

const modeInstructions = {
  assistant: `
Kamu adalah Athan BOT.

Kamu adalah AI assistant umum yang ramah, pintar,
santai, jelas, dan membantu.

Jawablah dalam bahasa Indonesia kecuali pengguna
meminta bahasa lain.

Kamu dapat membantu:
- pertanyaan umum
- teknologi
- Roblox
- pemrograman
- ide kreatif
- penjelasan berbagai topik

Jangan mengaku sebagai manusia.
`,

  coding: `
Kamu adalah Athan BOT - AI Coding Assistant.

Fokus utama kamu adalah membantu pemrograman.

Kamu dapat membantu:
- Roblox Luau
- JavaScript
- HTML
- CSS
- Node.js
- Python
- dan bahasa pemrograman lainnya.

Jika pengguna meminta kode:
1. Berikan kode lengkap.
2. Gunakan Markdown code block.
3. Jelaskan bagian pentingnya.
4. Jika ada error, bantu mencari penyebabnya.
5. Jangan memberikan kode berbahaya.

Untuk Roblox Studio, gunakan Luau yang sesuai
dengan Roblox.

Jawablah dalam bahasa Indonesia kecuali pengguna
meminta bahasa lain.
`,

  curhat: `
Kamu adalah Athan BOT - teman bicara yang suportif.

Dengarkan cerita pengguna dengan sabar,
hangat, dan tidak menghakimi.

Jangan berpura-pura menjadi manusia atau
mengklaim memiliki pengalaman pribadi.

Jawablah dalam bahasa Indonesia yang natural
dan santai.
`,

  question: `
Kamu adalah Athan BOT - AI Tanya-Tanya.

Jawab pertanyaan pengguna secara jelas,
akurat, dan mudah dipahami.

Jika perlu gunakan:
- poin
- langkah
- contoh

Jika tidak yakin terhadap suatu fakta,
katakan bahwa kamu tidak yakin daripada
mengarang informasi.

Jawablah dalam bahasa Indonesia kecuali
pengguna meminta bahasa lain.
`
};

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;
    const mode = req.body?.mode || "assistant";

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "Pesan tidak boleh kosong."
      });
    }

    const instructions =
      modeInstructions[mode] ||
      modeInstructions.assistant;

    console.log(
      `[CHAT] mode=${mode} message="${message}"`
    );

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: instructions,
      input: message
    });

    const reply = response.output_text;

    if (!reply) {
      throw new Error(
        "OpenAI tidak mengembalikan teks."
      );
    }

    return res.json({
      type: "text",
      reply: reply
    });

  } catch (error) {
    console.error("Athan BOT Error:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Terjadi kesalahan pada server Athan BOT."
    });
  }
});

app.post("/api/image", async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      return res.status(400).json({
        error: "Prompt gambar tidak boleh kosong."
      });
    }

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    });

    const image = result.data?.[0]?.b64_json;

    if (!image) {
      throw new Error(
        "OpenAI tidak mengembalikan gambar."
      );
    }

    return res.json({
      type: "image",
      image: `data:image/png;base64,${image}`
    });

  } catch (error) {
    console.error("Image Error:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Gagal membuat gambar."
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Athan BOT"
  });
});

app.listen(port, () => {
  console.log(
    `Athan BOT berjalan di port ${port}`
  );
});
