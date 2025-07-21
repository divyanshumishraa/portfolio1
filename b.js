const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");

let userName = null;

// Send message on button click or Enter key
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Append message to chat
function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle sending message
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  const botMsg = document.createElement("div");
  botMsg.classList.add("message", "bot");
  botMsg.textContent = "⌛ Typing...";
  chatWindow.appendChild(botMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const reply = await getSmartReply(message);
    setTimeout(() => {
      botMsg.textContent = reply;
    }, 500);
  } catch (err) {
    botMsg.textContent = "⚠️ Something went wrong.";
    console.error("Error getting reply:", err);
  }
}

// Try online API, fallback to offline
async function getSmartReply(input) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(
      "https://api.affiliateplus.xyz/api/chatbot?message=" +
        encodeURIComponent(input) +
        "&botname=Neo&ownername=Divyanshu",
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!res.ok) throw new Error("API failed");
    const data = await res.json();
    return data.message;
  } catch (err) {
    console.warn("🌐 Online failed, using offline mode:", err.message);
    return getBotReply(input);
  }
}

// Offline fallback logic
function getBotReply(input) {
  const msg = input.toLowerCase().trim();

  const normalized = msg
    .replace(/wiol/g, "will")
    .replace(/kon/g, "kaun")
    .replace(/tum ho/g, "tum kaun ho");

  if (/hello|hi|namaste|hey/.test(normalized)) {
    return userName
      ? `Hey again, ${userName}! 👋`
      : "Hey there! What's your name?";
  }

  if (/my name is|mera naam/.test(normalized)) {
    const nameMatch = msg.match(/(?:my name is|mera naam)\s+([a-zA-Z]+)/);
    if (nameMatch) {
      userName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
      return `Nice to meet you, ${userName}! 😊`;
    }
    return "I didn't catch your name. Try again?";
  }

  if (/how are you|kaise ho/.test(normalized)) {
    return "I'm just code, but I'm doing great! How about you?";
  }

  if (/tum kaun ho|who are you|tum kon ho|तुम कौन हो/.test(normalized)) {
    return "मैं एक स्मार्ट चैटबॉट हूँ, जो तुम्हारी मदद के लिए बना हूँ।";
  }

  if (/hindi|हिंदी/.test(normalized)) return "हाँ, मैं हिंदी में भी बात कर सकता हूँ।";
  if (/english|अंग्रेज़ी/.test(normalized)) return "Yes, I can talk in English too.";

  if (/your name|tumhara naam/.test(normalized)) {
    return "I'm your offline assistant 🤖. You can call me Neo.";
  }

  if (/bye|alvida/.test(normalized)) {
    return `Goodbye${userName ? ", " + userName : ""}! Come back soon. 👋`;
  }

  try {
    if (/^[0-9+\-*/ ().]+$/.test(normalized)) {
      const result = eval(normalized);
      return `🧮 The answer is: ${result}`;
    }
  } catch {
    return "⚠️ I tried solving that, but something went wrong.";
  }

  return "🤔 I didn't get that. Try asking me about math, language, or who I am!";
}

// 🎙️ Voice input
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN";
  recognition.interimResults = false;

  micBtn.addEventListener("click", () => {
    try {
      recognition.start();
      micBtn.textContent = "🎙️ Listening...";
    } catch (err) {
      console.error("🎤 Mic error:", err);
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    sendMessage();
    micBtn.textContent = "🎤";
  };

  recognition.onerror = (event) => {
    console.error("🎤 Speech error:", event.error);
    micBtn.textContent = "🎤";
  };

  recognition.onend = () => {
    micBtn.textContent = "🎤";
  };
} else {
  micBtn.disabled = true;
  micBtn.title = "Speech recognition not supported in this browser";
}
