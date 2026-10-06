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


// ===============================
// CHAT API
// ===============================

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


    const response =
      await client.responses.create({

        model: "gpt-5.6-luna",

        instructions: instructions,

        input: message

      });


    const reply =
      response.output_text;


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

    console.error(
      "Athan BOT Error:",
      error
    );


    return res.status(500).json({

      error:
        error?.message ||
        "Terjadi kesalahan pada server Athan BOT."

    });

  }

});


// ===============================
// IMAGE API
// ===============================

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


    const result =
      await client.images.generate({

        model: "gpt-image-1",

        prompt: prompt,

        size: "1024x1024"

      });


    const image =
      result.data?.[0]?.b64_json;


    if (!image) {

      throw new Error(
        "OpenAI tidak mengembalikan gambar."
      );

    }


    return res.json({

      type: "image",

      image:
        `data:image/png;base64,${image}`

    });


  } catch (error) {

    console.error(
      "Image Error:",
      error
    );


    return res.status(500).json({

      error:
        error?.message ||
        "Gagal membuat gambar."

    });

  }

});


// ===============================
// HEALTH CHECK
// ===============================

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

});        }
      });
    }
  }
);

// ======================================================
// ATHAN IMAGE API
// ======================================================
//
// POST /v1/images
//
// Authorization:
// Bearer sk-athan-...
//
// Body:
// {
//   "prompt": "sebuah kota futuristik"
// }

app.post(
  "/v1/images",
  requireAthanAPIKey,
  async (req, res) => {

    try {

      const prompt =
        req.body?.prompt;

      if (
        typeof prompt !== "string" ||
        !prompt.trim()
      ) {
        return res.status(400).json({
          error: {
            message:
              "Prompt gambar tidak boleh kosong.",
            type: "invalid_request_error"
          }
        });
      }

      const imageResponse =
        await client.images.generate({
          model: "gpt-image-2",
          prompt,
          size: "1024x1024"
        });

      const imageData =
        imageResponse.data?.[0];

      if (!imageData) {
        throw new Error(
          "OpenAI tidak mengembalikan gambar."
        );
      }

      if (imageData.b64_json) {

        return res.json({
          object: "image",
          type: "image",
          image:
            `data:image/png;base64,${imageData.b64_json}`
        });

      }

      if (imageData.url) {

        return res.json({
          object: "image",
          type: "image",
          image: imageData.url
        });

      }

      throw new Error(
        "Format hasil gambar tidak dikenali."
      );

    } catch (error) {

      console.error(
        "Athan Image Error:",
        error
      );

      return res.status(500).json({
        error: {
          message:
            error?.message ||
            "Athan gagal membuat gambar.",
          type: "server_error"
        }
      });
    }
  }
);

// ======================================================
// COMPATIBILITY ENDPOINT
// ======================================================
//
// Frontend lama kamu masih menggunakan:
// POST /api/chat
//
// Endpoint ini tetap dipertahankan agar index.html
// kamu tidak langsung rusak.
//
// Untuk akses publik, endpoint ini juga membutuhkan
// ATHAN_MASTER_KEY / API key.

app.post(
  "/api/chat",
  requireAthanAPIKey,
  async (req, res) => {

    try {

      const message =
        req.body?.message;

      const mode =
        req.body?.mode ||
        "assistant";

      if (
        typeof message !== "string" ||
        !message.trim()
      ) {
        return res.status(400).json({
          error:
            "Pesan tidak boleh kosong."
        });
      }

      if (mode === "image") {

        const imageResponse =
          await client.images.generate({
            model: "gpt-image-2",
            prompt: message,
            size: "1024x1024"
          });

        const imageData =
          imageResponse.data?.[0];

        if (!imageData) {
          throw new Error(
            "OpenAI tidak mengembalikan gambar."
          );
        }

        if (imageData.b64_json) {
          return res.json({
            type: "image",
            image:
              `data:image/png;base64,${imageData.b64_json}`
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

      const instructions =
        modeInstructions[mode] ||
        modeInstructions.assistant;

      const response =
        await client.responses.create({
          model: "gpt-6-luna",
          instructions,
          input: message
        });

      return res.json({
        type: "text",
        reply:
          response.output_text ||
          "Athan tidak memberikan jawaban."
      });

    } catch (error) {

      console.error(
        "Athan BOT Error:",
        error
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Athan BOT sedang mengalami masalah."
      });
    }
  }
);

// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "Unhandled Error:",
      error
    );

    res.status(500).json({
      error: {
        message: "Internal server error.",
        type: "server_error"
      }
    });
  }
);

// ======================================================
// START SERVER
// ======================================================

app.listen(port, () => {

  console.log(
    `Athan BOT berjalan di port ${port}`
  );

  console.log(
    "Athan API: /v1/chat"
  );

  console.log(
    "Athan Image API: /v1/images"
  );

  if (MASTER_KEY) {
    console.log(
      "Athan API Key System: AKTIF"
    );
  } else {
    console.log(
      "WARNING: ATHAN_MASTER_KEY belum diset."
    );
  }
});
