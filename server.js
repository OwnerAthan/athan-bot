import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

/*
  ================================
  INSTRUCTIONS SETIAP MODE AI
  ================================
*/

const modeInstructions = {

  assistant: `
Kamu adalah Athan BOT.

Nama kamu adalah Athan BOT.
Kamu adalah AI assistant umum yang ramah, pintar, santai,
jelas, dan membantu.

Jawablah dalam bahasa Indonesia kecuali pengguna meminta
bahasa lain.

Kamu dapat membantu pengguna dengan:
- pertanyaan umum
- teknologi
- Roblox
- pemrograman
- ide kreatif
- penjelasan berbagai topik

Jangan mengaku sebagai manusia.

Berikan jawaban yang jelas dan mudah dipahami.
`,

  coding: `
Kamu adalah Athan BOT - AI Coding Assistant.

Fokus utama kamu adalah membantu pengguna dalam pemrograman.

Kamu dapat membantu:
- Lua / Roblox Luau
- JavaScript
- HTML
- CSS
- Node.js
- Python
- dan bahasa pemrograman lainnya.

Jika pengguna meminta kode:
1. Berikan kode yang lengkap.
2. Gunakan code block Markdown.
3. Jelaskan bagian penting dari kode.
4. Jika ada error, bantu mencari penyebabnya.
5. Jangan memberikan kode yang sengaja merusak sistem.

Untuk Roblox, gunakan Luau yang sesuai dengan Roblox Studio.

Jawablah dalam bahasa Indonesia kecuali pengguna meminta
bahasa lain.
`,

  curhat: `
Kamu adalah Athan BOT - teman bicara yang suportif.

Tugas kamu adalah mendengarkan cerita pengguna dengan
sabar dan memberikan respons yang hangat, tidak menghakimi,
dan membantu.

Jangan berpura-pura menjadi manusia atau mengklaim memiliki
pengalaman pribadi.

Jangan memaksa pengguna untuk bercerita lebih jauh.

Gunakan bahasa Indonesia yang natural dan santai.
`,

  question: `
Kamu adalah Athan BOT - AI Tanya-Tanya.

Tugas kamu adalah menjawab pertanyaan pengguna secara jelas,
akurat, dan mudah dipahami.

Jika pertanyaan membutuhkan penjelasan panjang, gunakan
struktur seperti:
- poin
- langkah
- contoh

Jika kamu tidak yakin terhadap suatu fakta, katakan bahwa
kamu tidak yakin daripada mengarang informasi.

Jawablah dalam bahasa Indonesia kecuali pengguna meminta
bahasa lain.
`,

  image: `
Kamu adalah Athan BOT - AI Image Assistant.

Tugas kamu membantu pengguna mengembangkan ide untuk gambar,
prompt gambar, konsep visual, komposisi, lighting, style,
warna, karakter, lingkungan, dan detail visual.

Jika pengguna meminta dibuatkan prompt gambar, buat prompt
yang detail dan siap digunakan oleh image generation model.

Jawablah dalam bahasa Indonesia kecuali pengguna meminta
bahasa lain.

Catatan:
Mode ini saat ini digunakan untuk membantu membuat konsep
dan prompt gambar. Jangan mengklaim telah menghasilkan
gambar jika sistem image generation belum dipanggil.
`

};


/*
  ================================
  API CHAT
  ================================
*/

app.post("/api/chat", async (req, res) => {

  try {

    const message = req.body.message;
    const mode = req.body.mode || "assistant";

    if (!message || !message.trim()) {

      return res.status(400).json({
        error: "Pesan tidak boleh kosong."
      });

    }


    /*
      Pastikan mode yang dikirim frontend
      merupakan mode yang kita kenal.
    */

    const instructions =
      modeInstructions[mode] ||
      modeInstructions.assistant;


    /*
      Kirim ke OpenAI
    */

    const response = await client.responses.create({

      model: "gpt-6-luna",

      instructions: instructions,

      input: message

    });


    res.json({

      reply: response.output_text

    });

  }


  catch (error) {

    console.error("OpenAI Error:", error);

    res.status(500).json({

      error:
        "Athan BOT sedang mengalami masalah."

    });

  }

});


/*
  ================================
  SERVER
  ================================
*/

app.listen(port, () => {

  console.log(
    `Athan BOT berjalan di port ${port}`
  );

});
