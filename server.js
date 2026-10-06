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

AI MODE INSTRUCTIONS

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

Kamu membantu pengguna membuat prompt gambar
yang jelas dan detail.

Namun ketika mode image digunakan, server akan
mengirim prompt pengguna langsung ke image
generation API.

Jangan mengatakan bahwa gambar sudah dibuat
di dalam instruksi ini.
`

};

/*

CHAT / IMAGE API

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


  /*
  Biasanya API mengembalikan image data.
  Kita kirim kembali ke frontend.
  */

  if (imageData.b64_json) {

    return res.json({

      type: "image",

      image:
        `data:image/png;base64,${imageData.b64_json}`

    });

  }


  /*
  Fallback jika response menyediakan URL.
  */

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

}

catch (error) {

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

});

/*

SERVER

*/

app.listen(port, () => {

console.log(
"Athan BOT berjalan di port ${port}"
);

});Mode.status;

      chat.innerHTML = "";

      let welcomeText = "";

      if (mode === "image") {

        welcomeText =
          "Halo! Saya AI Gambar 🎨\\n\\n" +
          "Jelaskan gambar yang ingin kamu buat.";

      }

      else if (mode === "coding") {

        welcomeText =
          "Halo! Saya AI Coding 💻\\n\\n" +
          "Kirim kode atau jelaskan apa yang ingin kamu buat.";

      }

      else if (mode === "curhat") {

        welcomeText =
          "Halo 👋\\n\\n" +
          "Kamu boleh cerita. Saya akan mendengarkan dan membantu sebisa mungkin.";

      }

      else if (mode === "question") {

        welcomeText =
          "Halo! Saya AI Tanya-Tanya 🧠\\n\\n" +
          "Silakan tanyakan apa saja.";

      }

      else {

        welcomeText =
          "Halo! Saya Athan BOT 🤖\\n\\n" +
          "Ada yang bisa saya bantu?";

      }

      addMessage(welcomeText, "bot");

      input.focus();

    }


    /* ================= HOME ================= */

    function showHome() {

      home.style.display = "block";
      chat.style.display = "none";
      inputArea.style.display = "none";
      backButton.style.display = "none";

      headerTitle.textContent =
        "🤖 Athan BOT";

      headerStatus.textContent =
        "AI Assistant • Online";

    }


    /* ================= ADD MESSAGE ================= */

    function addMessage(text, type) {

      const message =
        document.createElement("div");

      message.className =
        "message " + type;

      if (type === "bot") {

        message.innerHTML =
          renderMarkdown(text);

      } else {

        message.textContent =
          text;

      }

      chat.appendChild(message);

      chat.scrollTop =
        chat.scrollHeight;

      return message;

    }


    /* ================= MARKDOWN ================= */

    function escapeHTML(text) {

      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }


    function renderMarkdown(text) {

      let safe =
        escapeHTML(text);

      const codeBlocks = [];

      /*
       * Simpan code block terlebih dahulu
       * supaya tidak ikut terkena formatting.
       */

      safe = safe.replace(
        /```(?:[a-zA-Z0-9_+-]+)?\n?([\s\S]*?)```/g,
        function(match, code) {

          const index =
            codeBlocks.length;

          codeBlocks.push(code);

          return `@@CODEBLOCK${index}@@`;

        }
      );


      /*
       * Bold
       */

      safe = safe.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );


      /*
       * Italic
       */

      safe = safe.replace(
        /(?<!\*)\*([^*]+)\*(?!\*)/g,
        "<em>$1</em>"
      );


      /*
       * Inline code
       */

      safe = safe.replace(
        /`([^`]+)`/g,
        "<code>$1</code>"
      );


      /*
       * Bullet list sederhana
       */

      safe = safe.replace(
        /(?:^|\n)- (.*?)(?=\n|$)/g,
        "<li>$1</li>"
      );


      safe = safe.replace(
        /(<li>.*?<\/li>)/gs,
        "<ul>$1</ul>"
      );


      /*
       * Baris baru
       */

      safe = safe.replace(
        /\n/g,
        "<br>"
      );


      /*
       * Kembalikan code block
       */

      codeBlocks.forEach(
        function(code, index) {

          const block =
            "<pre><code>" +
            code +
            "</code></pre>";

          safe =
            safe.replace(
              `@@CODEBLOCK${index}@@`,
              block
            );

        }
      );


      return safe;

    }


    /* ================= SEND ================= */

    async function sendMessage() {

      const text =
        input.value.trim();

      if (!text) return;


      addMessage(text, "user");

      input.value = "";

      button.disabled = true;


      const loading =
        addMessage(
          "Athan sedang berpikir...",
          "bot"
        );


      try {

        const response =
          await fetch("/api/chat", {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              message: text,

              mode: currentMode

            })

          });


        const data =
          await response.json();


        loading.innerHTML =
          renderMarkdown(
            data.reply ||
            data.error ||
            "Terjadi kesalahan."
          );


      }

      catch (error) {

        loading.textContent =
          "Tidak dapat terhubung ke Athan BOT.";

      }


      button.disabled = false;

      input.focus();

    }


    /* ================= EVENTS ================= */

    button.addEventListener(
      "click",
      sendMessage
    );


    input.addEventListener(
      "keydown",
      function(event) {

        if (event.key === "Enter") {

          sendMessage();

        }

      }
    );

  </script>

</body>
</html>
