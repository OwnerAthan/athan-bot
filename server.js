import express from "express";
import OpenAI from "openai";
import crypto from "node:crypto";

const app = express();
const port = process.env.PORT || 3000;

// ======================================================
// OPENAI CLIENT
// ======================================================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ======================================================
// BASIC CONFIG
// ======================================================

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

// ======================================================
// ATHAN API KEY SYSTEM
// ======================================================

// API key disimpan di memory untuk versi awal.
// Untuk production, sebaiknya pindahkan ke database.
const athanApiKeys = new Map();

/*
  Membuat API key Athan.

  Contoh:
  sk-athan-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
*/

function generateAthanAPIKey() {
  const randomPart = crypto
    .randomBytes(32)
    .toString("hex");

  return `sk-athan-${randomPart}`;
}

// ======================================================
// MASTER ADMIN KEY
// ======================================================

// Isi ATHAN_MASTER_KEY di Environment Variables.
//
// Contoh:
// ATHAN_MASTER_KEY=sk-athan-admin-xxxxxxxx
//
// Jangan taruh master key di frontend.

const MASTER_KEY = process.env.ATHAN_MASTER_KEY;

// ======================================================
// CREATE FIRST API KEY
// ======================================================

if (MASTER_KEY) {
  athanApiKeys.set(MASTER_KEY, {
    name: "Athan Admin",
    createdAt: new Date().toISOString(),
    active: true,
    requests: 0
  });
}

// ======================================================
// API KEY VALIDATION MIDDLEWARE
// ======================================================

function requireAthanAPIKey(req, res, next) {
  const authorization =
    req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: {
        message: "API key tidak ditemukan.",
        type: "authentication_error"
      }
    });
  }

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        message:
          "Gunakan Authorization: Bearer sk-athan-...",
        type: "authentication_error"
      }
    });
  }

  const apiKey =
    authorization.substring(7).trim();

  const keyData =
    athanApiKeys.get(apiKey);

  if (!keyData || !keyData.active) {
    return res.status(401).json({
      error: {
        message: "API key Athan tidak valid.",
        type: "authentication_error"
      }
    });
  }

  // Tambahkan informasi key ke request
  req.athanKey = apiKey;
  req.athanKeyData = keyData;

  // Hitung request
  keyData.requests++;

  next();
}

// ======================================================
// AI MODE INSTRUCTIONS
// ======================================================

const modeInstructions = {

  assistant: `
Kamu adalah Athan BOT.

Nama kamu adalah Athan BOT.

Kamu adalah AI assistant umum yang ramah,
pintar, santai, jelas, dan membantu.

Jawablah dalam bahasa Indonesia kecuali
pengguna meminta bahasa lain.

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

Jawablah dalam bahasa Indonesia kecuali
pengguna meminta bahasa lain.
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

// ======================================================
// ROOT / STATUS
// ======================================================

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: "public"
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    name: "Athan BOT",
    status: "online",
    api: "Athan API",
    version: "1.0.0"
  });
});

// ======================================================
// CREATE API KEY
// ======================================================
//
// POST /v1/keys
//
// Header:
// Authorization: Bearer MASTER_KEY
//
// Body:
// {
//   "name": "Website Saya"
// }

app.post(
  "/v1/keys",
  (req, res) => {

    const authorization =
      req.headers.authorization;

    if (!MASTER_KEY) {
      return res.status(500).json({
        error: {
          message:
            "ATHAN_MASTER_KEY belum dikonfigurasi.",
          type: "server_configuration_error"
        }
      });
    }

    if (
      authorization !==
      `Bearer ${MASTER_KEY}`
    ) {
      return res.status(401).json({
        error: {
          message: "Master key tidak valid.",
          type: "authentication_error"
        }
      });
    }

    const name =
      typeof req.body?.name === "string" &&
      req.body.name.trim()
        ? req.body.name.trim()
        : "Athan API User";

    const apiKey =
      generateAthanAPIKey();

    athanApiKeys.set(apiKey, {
      name,
      createdAt: new Date().toISOString(),
      active: true,
      requests: 0
    });

    return res.status(201).json({
      object: "api_key",
      name,
      api_key: apiKey,
      created_at: new Date().toISOString()
    });
  }
);

// ======================================================
// LIST API KEYS
// ======================================================

app.get(
  "/v1/keys",
  (req, res) => {

    const authorization =
      req.headers.authorization;

    if (
      !MASTER_KEY ||
      authorization !==
      `Bearer ${MASTER_KEY}`
    ) {
      return res.status(401).json({
        error: {
          message: "Master key tidak valid.",
          type: "authentication_error"
        }
      });
    }

    const keys = [];

    for (const [key, data] of athanApiKeys) {

      keys.push({
        api_key:
          key === MASTER_KEY
            ? "MASTER_KEY"
            : `${key.substring(0, 14)}...`,
        name: data.name,
        created_at: data.createdAt,
        active: data.active,
        requests: data.requests
      });
    }

    return res.json({
      object: "list",
      data: keys
    });
  }
);

// ======================================================
// REVOKE API KEY
// ======================================================
//
// POST /v1/keys/revoke
//
// Body:
// {
//   "api_key": "sk-athan-..."
// }

app.post(
  "/v1/keys/revoke",
  (req, res) => {

    const authorization =
      req.headers.authorization;

    if (
      !MASTER_KEY ||
      authorization !==
      `Bearer ${MASTER_KEY}`
    ) {
      return res.status(401).json({
        error: {
          message: "Master key tidak valid.",
          type: "authentication_error"
        }
      });
    }

    const apiKey =
      req.body?.api_key;

    if (
      typeof apiKey !== "string"
    ) {
      return res.status(400).json({
        error: {
          message: "api_key wajib diisi.",
          type: "invalid_request_error"
        }
      });
    }

    const keyData =
      athanApiKeys.get(apiKey);

    if (!keyData) {
      return res.status(404).json({
        error: {
          message: "API key tidak ditemukan.",
          type: "not_found_error"
        }
      });
    }

    keyData.active = false;

    return res.json({
      success: true,
      message: "API key berhasil dinonaktifkan."
    });
  }
);

// ======================================================
// ATHAN CHAT API
// ======================================================
//
// POST /v1/chat
//
// Authorization:
// Bearer sk-athan-...
//
// Body:
// {
//   "message": "Halo Athan",
//   "mode": "assistant"
// }

app.post(
  "/v1/chat",
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
          error: {
            message:
              "Pesan tidak boleh kosong.",
            type: "invalid_request_error"
          }
        });
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
        object: "chat.response",
        model: "athan-chat",
        type: "text",
        reply:
          response.output_text ||
          "Athan tidak memberikan jawaban."
      });

    } catch (error) {

      console.error(
        "Athan Chat Error:",
        error
      );

      return res.status(500).json({
        error: {
          message:
            error?.message ||
            "Athan BOT mengalami masalah.",
          type: "server_error"
        }
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
