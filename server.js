import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// ===============================
// OLLAMA CONFIG
// ===============================

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "llama3.2";


// ===============================
// EXPRESS
// ===============================

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.static("public")
);


// ===============================
// ATHAN BOT INSTRUCTIONS
// ===============================

const modeInstructions = {

  assistant: `
Kamu adalah Athan BOT.

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
- berbagai topik lainnya

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
- bahasa pemrograman lainnya

Jika pengguna meminta kode:

1. Berikan kode lengkap.
2. Gunakan Markdown code block.
3. Jelaskan bagian penting.
4. Jika ada error, bantu mencari penyebabnya.
5. Untuk Roblox Studio gunakan Luau.

Jawablah dalam bahasa Indonesia kecuali
pengguna meminta bahasa lain.
`,

  curhat: `
Kamu adalah Athan BOT - teman bicara yang suportif.

Dengarkan cerita pengguna dengan sabar,
hangat, dan tidak menghakimi.

Jangan berpura-pura menjadi manusia
atau mengklaim memiliki pengalaman pribadi.

Jawablah dalam bahasa Indonesia yang
natural dan santai.
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
// OLLAMA CHAT FUNCTION
// ===============================

async function askOllama(
  message,
  instructions
) {

  const prompt = `
${instructions}

Pesan pengguna:

${message}
`;


  const response = await fetch(
    `${OLLAMA_URL}/api/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({

        model: OLLAMA_MODEL,

        messages: [

          {
            role: "system",
            content:
              instructions
          },

          {
            role: "user",
            content:
              message
          }

        ],

        stream: false

      })

    }
  );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Ollama HTTP ${response.status}: ${errorText}`
    );

  }


  const data =
    await response.json();


  const reply =
    data?.message?.content;


  if (!reply) {

    throw new Error(
      "Ollama tidak mengembalikan jawaban."
    );

  }


  return reply;

}


// ===============================
// CHAT API
// ===============================

app.post(
  "/api/chat",
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


      const instructions =
        modeInstructions[mode] ||
        modeInstructions.assistant;


      console.log(
        `[CHAT] mode=${mode}`
      );


      const reply =
        await askOllama(
          message,
          instructions
        );


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
          "Terjadi kesalahan pada Ollama."

      });

    }

  }
);


// ===============================
// HEALTH CHECK
// ===============================

app.get(
  "/api/health",
  async (req, res) => {

    try {

      const response =
        await fetch(
          `${OLLAMA_URL}/api/tags`
        );


      if (!response.ok) {

        throw new Error(
          `Ollama HTTP ${response.status}`
        );

      }


      const data =
        await response.json();


      return res.json({

        status: "ok",

        service: "Athan BOT",

        ai: "Ollama",

        model: OLLAMA_MODEL,

        ollama: true,

        models:
          data.models || []

      });


    } catch (error) {

      return res.status(500).json({

        status: "error",

        service: "Athan BOT",

        ai: "Ollama",

        ollama: false,

        error:
          error?.message ||
          "Ollama tidak dapat dihubungi."

      });

    }

  }
);


// ===============================
// IMAGE
// ===============================

app.post(
  "/api/image",
  async (req, res) => {

    return res.status(501).json({

      error:
        "AI Gambar belum tersedia pada konfigurasi Ollama ini."

    });

  }
);


// ===============================
// START SERVER
// ===============================

app.listen(
  port,
  () => {

    console.log(
      `Athan BOT berjalan di port ${port}`
    );

    console.log(
      `Ollama URL: ${OLLAMA_URL}`
    );

    console.log(
      `Ollama Model: ${OLLAMA_MODEL}`
    );

  }
);
