import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

/*
========================================
AI MODE INSTRUCTIONS
========================================
*/

const modeInstructions = {
  assistant: `
Kamu adalah Athan BOT.

Nama kamu adalah Athan BOT.
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

Jika perlu, gunakan:
- poin
- langkah
- contoh

Jika tidak yakin terhadap suatu fakta,
katakan bahwa kamu tidak yakin daripada
mengarang informasi.

Jawablah dalam bahasa Indonesia kecuali
pengguna meminta bahasa lain.
`,

  image: `
Kamu adalah Athan BOT - AI Image Assistant.

Mode ini digunakan untuk membantu pengguna
menghasilkan gambar menggunakan image generation API.
`
};


/*
========================================
API CHAT
========================================
*/

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;
    const mode = req.body.mode || "assistant";

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "Pesan tidak boleh kosong."
      });
    }

    /*
    ========================================
    AI GAMBAR
    ========================================
    */

    if (mode === "image") {
      const imageResponse = await client.images.generate({
        model: "gpt-image-2",
        prompt: message,
        size: "1024x1024"
      });

      const imageData = imageResponse.data?.[0];

      if (!imageData) {
        throw new Error(
          "OpenAI tidak mengembalikan gambar."
        );
      }

      if (imageData.b64_json) {
        return res.json({
          type: "image",
          image: `data:image/png;base64,${imageData.b64_json}`
        });
      }

      if (imageData.url) {
        return res.json({
          type: "image",
          image: imageData.url
        });
      }

      throw new Error(
        "Format hasil gambar tidak dikenali."
      );
    }


    /*
    ========================================
    CHAT TEXT
    ========================================
    */

    const instructions =
      modeInstructions[mode] ||
      modeInstructions.assistant;

    const response = await client.responses.create({
      model: "gpt-6-luna",
      instructions: instructions,
      input: message
    });

    return res.json({
      type: "text",
      reply:
        response.output_text ||
        "Athan tidak memberikan jawaban."
    });

  } catch (error) {
    console.error("Athan BOT Error:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Athan BOT sedang mengalami masalah."
    });
  }
});


/*
========================================
SERVER
========================================
*/

app.listen(port, () => {
  console.log(`Athan BOT berjalan di port ${port}`);
});
