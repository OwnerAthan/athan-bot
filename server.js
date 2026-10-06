<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Athan BOT</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }

    body {
      background: #0b0b0f;
      color: white;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .app {
      width: 100%;
      max-width: 760px;
      height: 92vh;
      background: #111116;
      border: 1px solid #27272f;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* ================= HEADER ================= */

    .header {
      padding: 17px 20px;
      background: #15151c;
      border-bottom: 1px solid #27272f;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .back-button {
      display: none;
      width: 38px;
      height: 38px;
      padding: 0;
      border-radius: 10px;
      background: #24242c;
      color: white;
      font-size: 20px;
    }

    .logo {
      font-size: 21px;
      font-weight: bold;
    }

    .status {
      color: #8d8d99;
      font-size: 13px;
      margin-top: 3px;
    }

    /* ================= HOME ================= */

    .home {
      flex: 1;
      overflow-y: auto;
      padding: 28px 20px;
    }

    .welcome {
      padding: 10px 2px 25px;
    }

    .welcome h1 {
      font-size: 30px;
      margin-bottom: 10px;
    }

    .welcome p {
      color: #9a9aa6;
      font-size: 15px;
      line-height: 1.5;
    }

    .section-title {
      font-size: 15px;
      color: #b4b4bf;
      margin-bottom: 12px;
      font-weight: bold;
    }

    .ai-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .ai-card {
      background: #1a1a22;
      border: 1px solid #292932;
      border-radius: 17px;
      padding: 18px;
      min-height: 145px;
      cursor: pointer;
      transition: 0.2s ease;
      color: white;
      text-align: left;
    }

    .ai-card:hover {
      background: #20202a;
      transform: translateY(-2px);
      border-color: #3a3a46;
    }

    .ai-icon {
      width: 44px;
      height: 44px;
      border-radius: 13px;
      background: #25252e;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 16px;
    }

    .ai-card h3 {
      font-size: 16px;
      margin-bottom: 7px;
    }

    .ai-card p {
      color: #92929d;
      font-size: 13px;
      line-height: 1.4;
    }

    .assistant-card {
      margin-top: 12px;
      background: #1a1a22;
      border: 1px solid #292932;
      border-radius: 17px;
      padding: 19px;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .assistant-card:hover {
      background: #20202a;
    }

    .assistant-card h3 {
      font-size: 17px;
      margin-bottom: 7px;
    }

    .assistant-card p {
      color: #92929d;
      font-size: 13px;
    }

    /* ================= CHAT ================= */

    .chat {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: none;
    }

    .message {
      max-width: 88%;
      padding: 12px 15px;
      border-radius: 14px;
      margin-bottom: 14px;
      line-height: 1.55;
      word-wrap: break-word;
    }

    .bot {
      background: #1c1c24;
      margin-right: auto;
    }

    .user {
      background: #ffffff;
      color: #111;
      margin-left: auto;
    }

    /* Markdown */

    .message strong {
      font-weight: 700;
    }

    .message em {
      font-style: italic;
    }

    .message code {
      background: #101016;
      padding: 2px 6px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 13px;
    }

    .message pre {
      background: #0c0c11;
      border: 1px solid #292932;
      padding: 13px;
      border-radius: 10px;
      overflow-x: auto;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    .message pre code {
      background: transparent;
      padding: 0;
      font-size: 13px;
      white-space: pre;
    }

    .message ul {
      padding-left: 20px;
      margin: 8px 0;
    }

    .message ol {
      padding-left: 20px;
      margin: 8px 0;
    }

    .message p {
      margin-bottom: 8px;
    }

    .message p:last-child {
      margin-bottom: 0;
    }

    /* ================= INPUT ================= */

    .input-area {
      padding: 15px;
      background: #15151c;
      border-top: 1px solid #27272f;
      display: none;
      gap: 10px;
    }

    input {
      flex: 1;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #30303a;
      background: #0d0d12;
      color: white;
      outline: none;
      font-size: 15px;
    }

    input:focus {
      border-color: #4a4a58;
    }

    .send-button {
      border: none;
      border-radius: 12px;
      padding: 0 20px;
      background: white;
      color: black;
      font-weight: bold;
      cursor: pointer;
    }

    .send-button:disabled {
      opacity: 0.5;
    }

    /* ================= MOBILE ================= */

    @media (max-width: 600px) {
      body {
        align-items: stretch;
      }

      .app {
        max-width: none;
        height: 100vh;
        border-radius: 0;
        border: none;
      }

      .home {
        padding: 24px 16px;
      }

      .welcome h1 {
        font-size: 27px;
      }

      .ai-grid {
        gap: 10px;
      }

      .ai-card {
        padding: 15px;
        min-height: 135px;
      }

      .chat {
        padding: 16px;
      }

      .message {
        max-width: 92%;
      }
    }
  </style>
</head>

<body>

  <div class="app">

    <!-- HEADER -->
    <div class="header">

      <button
        class="back-button"
        id="backButton"
        onclick="showHome()"
      >
        ←
      </button>

      <div>
        <div class="logo" id="headerTitle">🤖 Athan BOT</div>
        <div class="status" id="headerStatus">
          AI Assistant • Online
        </div>
      </div>

    </div>


    <!-- ================= HOME ================= -->

    <div class="home" id="home">

      <div class="welcome">
        <h1>Halo 👋</h1>

        <p>
          Selamat datang di Athan BOT.
          Pilih AI yang ingin kamu gunakan.
        </p>
      </div>

      <div class="section-title">
        Pilih AI
      </div>

      <div class="ai-grid">

        <div
          class="ai-card"
          onclick="openChat('image')"
        >
          <div class="ai-icon">🎨</div>

          <h3>AI Gambar</h3>

          <p>
            Buat dan kembangkan ide gambar
            dengan bantuan AI.
          </p>
        </div>


        <div
          class="ai-card"
          onclick="openChat('coding')"
        >
          <div class="ai-icon">💻</div>

          <h3>AI Coding</h3>

          <p>
            Bantu membuat, memperbaiki,
            dan menjelaskan kode.
          </p>
        </div>


        <div
          class="ai-card"
          onclick="openChat('curhat')"
        >
          <div class="ai-icon">💬</div>

          <h3>AI Curhat</h3>

          <p>
            Tempat ngobrol dan menuangkan
            cerita dengan nyaman.
          </p>
        </div>


        <div
          class="ai-card"
          onclick="openChat('question')"
        >
          <div class="ai-icon">🧠</div>

          <h3>AI Tanya-Tanya</h3>

          <p>
            Tanyakan berbagai hal dan
            dapatkan penjelasan.
          </p>
        </div>

      </div>


      <div
        class="assistant-card"
        onclick="openChat('assistant')"
      >

        <h3>🤖 AI Assistant</h3>

        <p>
          Asisten umum Athan BOT untuk
          berbagai kebutuhan.
        </p>

      </div>

    </div>


    <!-- ================= CHAT ================= -->

    <div class="chat" id="chat">

      <div class="message bot">
        Halo! Saya Athan BOT 👋
        <br><br>
        Ada yang bisa saya bantu?
      </div>

    </div>


    <!-- ================= INPUT ================= -->

    <div class="input-area" id="inputArea">

      <input
        id="messageInput"
        type="text"
        placeholder="Ketik pesan..."
        autocomplete="off"
      >

      <button
        class="send-button"
        id="sendButton"
      >
        Kirim
      </button>

    </div>

  </div>


  <script>

    const input =
      document.getElementById("messageInput");

    const button =
      document.getElementById("sendButton");

    const chat =
      document.getElementById("chat");

    const home =
      document.getElementById("home");

    const inputArea =
      document.getElementById("inputArea");

    const backButton =
      document.getElementById("backButton");

    const headerTitle =
      document.getElementById("headerTitle");

    const headerStatus =
      document.getElementById("headerStatus");


    let currentMode = "assistant";


    const modes = {

      image: {
        title: "🎨 AI Gambar",
        status: "Image Assistant"
      },

      coding: {
        title: "💻 AI Coding",
        status: "Coding Assistant"
      },

      curhat: {
        title: "💬 AI Curhat",
        status: "Companion Assistant"
      },

      question: {
        title: "🧠 AI Tanya-Tanya",
        status: "General Assistant"
      },

      assistant: {
        title: "🤖 AI Assistant",
        status: "AI Assistant • Online"
      }

    };


    /* ================= OPEN CHAT ================= */

    function openChat(mode) {

      currentMode = mode;

      const selectedMode = modes[mode];

      home.style.display = "none";
      chat.style.display = "block";
      inputArea.style.display = "flex";
      backButton.style.display = "block";

      headerTitle.textContent =
        selectedMode.title;

      headerStatus.textContent =
        selectedMode.status;

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
