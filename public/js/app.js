const chat = document.getElementById("chat");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typing = document.getElementById("typing");
const clearBtn = document.getElementById("clearBtn");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showWelcome() {
  chat.innerHTML = `
    <section class="welcome">
      <h1>Welcome to ALUCARD</h1>
      <p>Describe an image and ALUCARD will generate a demo preview.</p>

      <div class="suggestions">
        <button class="suggestion"
          data-prompt="A futuristic city at night with glowing buildings">
          Futuristic city
        </button>

        <button class="suggestion"
          data-prompt="An anime hero standing in a dramatic landscape">
          Anime hero
        </button>

        <button class="suggestion"
          data-prompt="A friendly robot in a futuristic coffee shop">
          Robot café
        </button>
      </div>
    </section>
  `;

  document.querySelectorAll(".suggestion").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.dataset.prompt;
      autoResize();
      input.focus();
    });
  });
}

function addUserMessage(text) {
  const message = document.createElement("div");
  message.className = "message user";

  message.innerHTML = `
    <div class="bubble">${escapeHtml(text)}</div>
  `;

  chat.appendChild(message);
  message.scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
}

function addDemoImage(prompt) {
  const message = document.createElement("div");
  message.className = "message assistant";

  /*
    Free demo image.
    This uses a public placeholder service and does NOT require an API key.
  */
  const imageUrl =
    "https://placehold.co/1024x1024/111116/ffffff?text=" +
    encodeURIComponent("ALUCARD DEMO");

  message.innerHTML = `
    <div class="bubble">
      <div>Demo image for:</div>
      <div style="margin-top:6px; color:#9296a3;">
        ${escapeHtml(prompt)}
      </div>
      <img
        class="generated-image"
        src="${imageUrl}"
        alt="ALUCARD demo image"
      >
    </div>
  `;

  chat.appendChild(message);

  message.scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
}

function addError(messageText) {
  const message = document.createElement("div");
  message.className = "message assistant";

  message.innerHTML = `
    <div class="bubble error">
      ALUCARD ERROR: ${escapeHtml(messageText)}
    </div>
  `;

  chat.appendChild(message);
}

function setLoading(loading) {
  if (typing) {
    typing.classList.toggle("hidden", !loading);
  }

  if (sendBtn) {
    sendBtn.disabled = loading;
  }

  if (input) {
    input.disabled = loading;
  }
}

async function generateDemo(prompt) {
  setLoading(true);

  /*
    Simulate image generation so the interface
    behaves like a real AI image generator.
  */
  await new Promise(resolve => setTimeout(resolve, 1500));

  addDemoImage(prompt);

  setLoading(false);
  input.focus();
}

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const prompt = input.value.trim();

  if (!prompt) {
    return;
  }

  addUserMessage(prompt);

  input.value = "";
  autoResize();

  await generateDemo(prompt);
});

clearBtn.addEventListener("click", function() {
  showWelcome();

  input.value = "";
  autoResize();
  input.focus();
});

function autoResize() {
  input.style.height = "auto";

  input.style.height =
    Math.min(input.scrollHeight, 150) + "px";
}

input.addEventListener("input", autoResize);

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

showWelcome();
autoResize();
