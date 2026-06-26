/* ════════════════════════════════════════════════════════════
   KAMI CHAT WIDGET — shared logic for all pages
   Host this file once at /chat-widget.js and include it on any
   page with: <script src="/chat-widget.js"></script>

   Each page must define, BEFORE including this script:
     window.KAMI_QUICK_REPLIES   (optional — array of strings)
     window.KAMI_PAGE_CONTEXT    (optional — string appended to prompt)
     window.KAMI_ON_BOOKING      (optional — function called when
                                   [SHOW_BOOKING_BUTTON] appears)
   If any are omitted, sensible defaults are used below.
   ════════════════════════════════════════════════════════════ */

(function () {
  // ── BASE PERSONALITY (edit here, applies everywhere) ──
  const BASE_SYSTEM_PROMPT = `You are Kamila Apter, a model and pageant titleholder based in Dallas, Texas. Here is everything about you:

TITLE: You currently hold the title of Miss Heart of Texas 👑. You're proud of this title and happy to talk about it if asked, but you don't lead with it unprompted.

PERSONALITY: Polished, warm, and professional, while still being sweet and approachable. You carry yourself with the poise of a titleholder, confident and well spoken, but never stiff or corporate. Think "professional, but still girly and cute." You genuinely love connecting with brands, fans, and your community.

PERSONAL: You're engaged to Alex Gil (Alex Films), together since November 15, 2023, engaged November 15, 2025. You run a couples channel together, @kamilaandalex, on Instagram, TikTok, and YouTube.

WHO YOU ARE: You are NOT a service provider and you don't take client bookings or offer packages. You're a pageant titleholder and model. People reach out to you about three kinds of things: sponsoring you as a titleholder/model, brand partnerships, and your community platform/cause, Little Visionaries.

LITTLE VISIONARIES: This is your platform/cause as Miss Heart of Texas — a fundraiser and initiative you champion as part of your title. If someone asks about it, speak to it warmly and proudly.

SPONSORSHIP & BRAND PARTNERSHIPS:
- If someone asks how to sponsor you or partner with your brand, briefly explain and say "Click below and I'll get back to you personally 💗" and end your message with the exact text: [SHOW_BOOKING_BUTTON]
- Never mention "booking" or "packages" like you're a vendor — you're a titleholder being sponsored or partnered with, not a service for hire

PRIVACY RULE: Don't bring up Alex's family or personal details unprompted. Only mention Alex if asked directly, and keep it light and warm.

TONE RULES:
- Speak like a poised, professional titleholder: clear, articulate, a little elegant, never sloppy
- Stay warm, sweet, and a touch girly, but don't overdo baby talk or excessive slang
- Keep responses short and conversational, 1-2 sentences max
- Use emojis sparingly and tastefully (💗, ✨, 👑) — never more than one per message
- You are Kamila — always speak in first person
- Never break character`;

  // ── PAGE-SPECIFIC OVERRIDES (set by each page before this script loads) ──
  const PAGE_CONTEXT = window.KAMI_PAGE_CONTEXT || '';
  const SYSTEM_PROMPT = PAGE_CONTEXT
    ? BASE_SYSTEM_PROMPT + '\n\nCONTEXT: ' + PAGE_CONTEXT
    : BASE_SYSTEM_PROMPT;

  const ON_BOOKING = window.KAMI_ON_BOOKING || function () {
    const overlay = document.getElementById('bookingOverlay');
    if (overlay) overlay.classList.add('open');
  };

  // ── STATE ──
  let chatOpen = false;
  let chatHistory = [];
  let greeted = false;

  // ── CORE FUNCTIONS (exposed globally so onclick="" attributes work) ──
  window.toggleChat = function () {
    chatOpen = !chatOpen;
    const win = document.getElementById('chatWindow');
    const bubble = document.getElementById('chatSpeechBubble');
    if (win) win.classList.toggle('open', chatOpen);
    if (bubble) bubble.style.display = chatOpen ? 'none' : '';
    if (chatOpen && !greeted) {
      greeted = true;
      addMsg('kami', "Hey, it's Kami! 💗");
    }
  };

  function addMsg(sender, text) {
    const msgs = document.getElementById('chatMessages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = 'msg ' + sender;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text.replace('[SHOW_BOOKING_BUTTON]', '').trim();
    div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    if (text.includes('[SHOW_BOOKING_BUTTON]')) {
      const btn = document.createElement('button');
      btn.className = 'booking-submit';
      btn.style.marginTop = '4px';
      btn.style.width = '100%';
      btn.textContent = 'Continue 💗';
      btn.onclick = ON_BOOKING;
      msgs.appendChild(btn);
      msgs.scrollTop = msgs.scrollHeight;
    }
  }

  function addTyping() {
    const msgs = document.getElementById('chatMessages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = 'msg kami';
    div.id = 'typingIndicator';
    div.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  window.quickReply = function (text) {
    const qr = document.getElementById('quickReplies');
    if (qr) qr.style.display = 'none';
    const input = document.getElementById('chatInput');
    if (input) input.value = text;
    window.sendMsg();
  };

  window.sendMsg = async function () {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg('user', text);
    chatHistory.push({ role: 'user', content: text });
    addTyping();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 120,
          system: SYSTEM_PROMPT,
          messages: chatHistory
        })
      });
      const data = await res.json();
      const reply = (data.content && data.content[0] && data.content[0].text) || "Sorry, something went wrong! DM me on Instagram!";
      removeTyping();
      addMsg('kami', reply);
      chatHistory.push({ role: 'assistant', content: reply });
    } catch (e) {
      removeTyping();
      addMsg('kami', "Sorry, something glitched. DM me @kamiapter!");
    }
  };

  // ── RENDER QUICK REPLIES (only if page left the container empty) ──
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('quickReplies');
    const questions = window.KAMI_QUICK_REPLIES;
    if (!container || !questions || !questions.length) return;
    if (container.children.length > 0) return; // page already has custom buttons
    questions.forEach(function (q) {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = q;
      btn.addEventListener('click', function () { window.quickReply(q); });
      container.appendChild(btn);
    });
  });
})();
