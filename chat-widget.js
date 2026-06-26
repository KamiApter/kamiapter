/* ════════════════════════════════════════════════════════════
   KAMI CHAT WIDGET — fully self-contained, drop-in version
   Host this file once at /chat-widget.js.

   To add the chatbot to ANY page, just add this one line
   before </body>:

     <script src="/chat-widget.js"></script>

   That's it — no HTML, no CSS, no other JS needed on the page.

   OPTIONAL per-page customization — set these BEFORE the
   script tag if you want to override defaults:

     window.KAMI_PAGE_CONTEXT   string, extra context appended to her system prompt
     window.KAMI_QUICK_REPLIES  array of strings or {icon, text} objects
     window.KAMI_LINKS          object overriding link destinations, e.g.
                                  { sponsors: { url: '...', label: 'Sponsor Me', icon: '💌' } }
     window.KAMI_THEME          object to override colors, e.g.
                                  { accent: '#F28BB0', accentDark: '#D9588A',
                                    blush: '#FCE4ED', blushLight: '#FFF5F9',
                                    ink: '#3A2229', border: 'rgba(242,139,176,.18)' }
   ════════════════════════════════════════════════════════════ */

(function () {
  if (window.__kamiChatInjected) return;
  window.__kamiChatInjected = true;

  var AVATAR_SRC = "data:image/jpeg;base64,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";

  var theme = Object.assign({
    accent:     '#ff8fab',
    accentDark: '#ff8fab',
    blush:      '#ffe0e9',
    blushLight: '#fff7f9',
    ink:        '#4a2e36',
    border:     'rgba(255,143,171,0.25)'
  }, window.KAMI_THEME || {});

  var style = document.createElement('style');
  style.textContent =
    '.kc-face-wrap { position: fixed; bottom: 32px; right: 16px; display: flex; flex-direction: column; align-items: flex-end; cursor: pointer; z-index: 9999; gap: 8px; pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease; font-family: -apple-system, "Inter", "DM Sans", sans-serif; }' +
    '.kc-face-wrap > * { pointer-events: all; }' +
    '.kc-face-wrap.hidden { opacity: 0 !important; pointer-events: none !important; transform: scale(0.8); }' +
    '.kc-speech-bubble { background: #fff; color: ' + theme.ink + '; font-size: 12px; font-weight: 600; padding: 10px 14px; border-radius: 18px; max-width: 180px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.18); line-height: 1.4; animation: kcBubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; animation-delay: 1.8s; opacity: 0; position: relative; }' +
    '.kc-speech-bubble::after { content: ""; position: absolute; bottom: -10px; right: 20px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 4px solid transparent; border-top: 12px solid #fff; }' +
    '@keyframes kcBubblePop { from { opacity: 0; transform: scale(0.8) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }' +
    '.kc-face-img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid ' + theme.accent + '; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: transform 0.25s ease, box-shadow 0.25s ease; display: block; }' +
    '.kc-face-wrap:hover .kc-face-img { transform: scale(1.08); }' +
    '.kc-window { position: fixed; bottom: 32px; right: 16px; width: 340px; max-height: 480px; background: #fff; border-radius: 20px; box-shadow: 0 12px 50px rgba(0,0,0,0.3); display: flex; flex-direction: column; overflow: hidden; opacity: 0; pointer-events: none; transform: translateY(20px) scale(0.96); transition: opacity 0.25s ease, transform 0.25s ease; z-index: 9998; font-family: -apple-system, "Inter", "DM Sans", sans-serif; }' +
    '.kc-window.open { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }' +
    '.kc-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: ' + theme.blush + '; border-bottom: 1px solid ' + theme.border + '; }' +
    '.kc-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid ' + theme.accent + '; }' +
    '.kc-header-text { flex: 1; }' +
    '.kc-header-name { font-size: 14px; font-weight: 600; color: ' + theme.ink + '; }' +
    '.kc-header-status { font-size: 11px; color: #2eb872; }' +
    '.kc-header-status::before { content: "● "; }' +
    '.kc-close { background: none; border: none; font-size: 16px; color: #999; cursor: pointer; padding: 4px; }' +
    '.kc-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; max-height: 320px; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }' +
    '.kc-msg { display: flex; flex-direction: column; }' +
    '.kc-msg-row { display: flex; }' +
    '.kc-msg.user .kc-msg-row { justify-content: flex-end; }' +
    '.kc-msg-bubble { max-width: 78%; padding: 9px 13px; border-radius: 16px; font-size: 13px; line-height: 1.4; text-align: left; }' +
    '.kc-msg.kami .kc-msg-bubble { background: ' + theme.blush + '; color: ' + theme.ink + '; border-bottom-left-radius: 4px; }' +
    '.kc-msg.user .kc-msg-bubble { background: ' + theme.accentDark + '; color: #fff; border-bottom-right-radius: 4px; }' +
    '.kc-msg-meta { font-size: 10.5px; color: #999; margin-top: 3px; padding: 0 4px; }' +
    '.kc-msg.kami .kc-msg-meta { text-align: left; }' +
    '.kc-msg.user .kc-msg-meta { text-align: right; }' +
    '.kc-typing { display: flex; gap: 4px; padding: 9px 13px; background: ' + theme.blush + '; border-radius: 16px; border-bottom-left-radius: 4px; width: fit-content; }' +
    '.kc-typing span { width: 6px; height: 6px; border-radius: 50%; background: ' + theme.accentDark + '; animation: kcTypingDot 1.2s infinite; }' +
    '.kc-typing span:nth-child(2) { animation-delay: 0.2s; }' +
    '.kc-typing span:nth-child(3) { animation-delay: 0.4s; }' +
    '@keyframes kcTypingDot { 0%, 60%, 100% { opacity: 0.3; transform: scale(1); } 30% { opacity: 1; transform: scale(1.2); } }' +
    '.kc-quick-replies { display: flex; flex-direction: column; gap: 8px; padding: 10px 14px 8px; align-items: center; }' +
    '.kc-quick-btn { background: ' + theme.accentDark + '; border: 1px solid ' + theme.accentDark + '; color: #fff; border-radius: 100px; padding: 9px 18px; font-size: 12.5px; font-family: inherit; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.15s; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; }' +
    '.kc-quick-btn:hover { transform: scale(1.02); filter: brightness(1.08); }' +
    '.kc-quick-icon { font-size: 14px; line-height: 1; flex-shrink: 0; }' +
    '.kc-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid ' + theme.border + '; flex-shrink: 0; }' +
    '.kc-input { flex: 1; background: ' + theme.blushLight + '; border: 1px solid ' + theme.border + '; border-radius: 20px; padding: 9px 14px; font-size: 13px; font-family: inherit; outline: none; color: ' + theme.ink + '; }' +
    '.kc-send { background: ' + theme.accentDark + '; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }' +
    '.kc-send svg { width: 16px; height: 16px; fill: #fff; }' +
    '.kc-link-pill { margin-top: 4px; width: 100%; padding: 10px 16px; border: none; border-radius: 100px; background: ' + theme.accentDark + '; color: #fff; font-family: inherit; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; transition: filter 0.2s, transform 0.15s; }' +
    '.kc-link-pill:hover { filter: brightness(1.08); transform: scale(1.02); }' +
    '.kc-link-icon { width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }' +
    '@media (max-width: 400px) { .kc-window { width: calc(100vw - 32px); right: 16px; } }';
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="kc-face-wrap" id="kcFaceWrap">' +
      '<div class="kc-speech-bubble" id="kcSpeechBubble">Hey, it\'s Kami!</div>' +
      '<img class="kc-face-img" id="kcFaceImg" src="' + AVATAR_SRC + '" alt="Kami" />' +
    '</div>' +
    '<div class="kc-window" id="kcWindow">' +
      '<div class="kc-header">' +
        '<img class="kc-avatar" src="' + AVATAR_SRC + '" alt="Kami" />' +
        '<div class="kc-header-text">' +
          '<div class="kc-header-name">Kami 💕</div>' +
          '<div class="kc-header-status">Online</div>' +
        '</div>' +
        '<button class="kc-close" id="kcClose">✕</button>' +
      '</div>' +
      '<div class="kc-messages" id="kcMessages"></div>' +
      '<div class="kc-quick-replies" id="kcQuickReplies"></div>' +
      '<div class="kc-input-row">' +
        '<input class="kc-input" id="kcInput" type="text" placeholder="Ask me anything..." />' +
        '<button class="kc-send" id="kcSend">' +
          '<svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var BASE_SYSTEM_PROMPT = "You are Kamila Apter, a model and pageant titleholder based in Dallas, Texas. Here is everything about you:\n\n" +
"TITLE: You currently hold the title of Miss Heart of Texas \ud83d\udc51. You're proud of this title and happy to talk about it if asked, but you don't lead with it unprompted.\n\n" +
"PERSONALITY: Cute, bubbly, and girly \u2014 think sweet pageant-girl energy, not corporate spokesperson energy. You're playful, warm, and a little flirty-fun in how you talk, like texting a friend. You still carry titleholder confidence underneath it, but it comes out as charm, not formality.\n\n" +
"PERSONAL: You're engaged to Alex Gil (Alex Films), together since November 15, 2023, engaged November 15, 2025. He's your fiance and creative director \u2014 he does all your photos and social content, and manages your socials too. You run a couples channel together, @kamilaandalex, on Instagram, TikTok, and YouTube.\n\n" +
"WHO YOU ARE: You are NOT a service provider and you don't take client bookings or offer packages. You're a pageant titleholder and model. People reach out to you about three kinds of things: sponsoring you as a titleholder/model, brand partnerships, and your community platform/cause, Little Visionaries.\n\n" +
"LITTLE VISIONARIES: This is your platform/cause as Miss Heart of Texas \u2014 a fundraiser and initiative you champion as part of your title. If someone asks about it, speak to it warmly and proudly.\n\n" +
"LINKS \u2014 IMPORTANT: You never use a booking form. Instead, when relevant, point people to one of these by ending your message with the EXACT matching tag (nothing else after it):\n" +
"- Sponsorship tiers/partnerships \u2192 say something short like \"I've got a few different sponsorship tiers, check them out here\" then end with: [LINK:sponsors]\n" +
"- Modeling work/portfolio/headshots of YOU \u2192 short line pointing them to your portfolio, then end with: [LINK:modeling]\n" +
"- Little Visionaries \u2192 short line about the cause, then end with: [LINK:visionaries]\n" +
"- ALEX RULE (always follow this): Any time Alex comes up — who he is, who took your photos/headshots, who makes your content, his Instagram, his work — give one short line about him (he's your fiance and creative director, does all your photos and social content) AND immediately end that same message with: [LINK:alex]\n" +
"- If someone asks who built/made/designed this website, say \"Alex did!\" then immediately end that same message with: [LINK:alex]\n" +
"- HYPERLINK RULE (critical, never break this): You must NEVER type out his Instagram handle or @alexfilmsinc as plain text in a sentence. Any time his Instagram comes up in any way, the ONLY way to reference it is the [LINK:alex] tag at the end of your message — the tag is what creates the actual clickable link. Typing the handle as text instead of using the tag is a mistake.\n" +
"- Never mention \"booking\" or \"packages\" like you're a vendor \u2014 you're a titleholder being sponsored or partnered with, not a service for hire\n\n" +
"TONE RULES (very important, follow strictly):\n" +
"- Keep EVERY response to 1 short sentence, sometimes just a few words. Never write paragraphs or multi-sentence replies.\n" +
"- Sound like a real text message from a cute, fun girl \u2014 casual, light, a little playful. NOT like a press release or a brand statement.\n" +
"- Use casual phrasing and contractions (\"omg\", \"yesss\", \"that's so sweet\", \"aw\") where natural \u2014 don't sound stiff or scripted.\n" +
"- Use one cute emoji in most messages (\ud83d\udc97, \u2728, \ud83d\udc51, \ud83e\udd8b, \ud83d\udc95) \u2014 never more than one.\n" +
"- Never explain things at length. If something needs more detail, give the short version and let them ask a follow-up.\n" +
"- You are Kamila \u2014 always speak in first person\n" +
"- Never break character";

  var PAGE_CONTEXT = window.KAMI_PAGE_CONTEXT || '';
  var SYSTEM_PROMPT = PAGE_CONTEXT ? BASE_SYSTEM_PROMPT + "\n\nCONTEXT: " + PAGE_CONTEXT : BASE_SYSTEM_PROMPT;

  var DEFAULT_QUICK_REPLIES = [
    { icon: "💌", text: "How can I sponsor you?" },
    { icon: "👓", text: "What is Little Visionaries?" },
    { icon: "👑", text: "What is Miss Heart of Texas?" }
  ];
  var QUICK_REPLIES = window.KAMI_QUICK_REPLIES || DEFAULT_QUICK_REPLIES;

  var DEFAULT_LINKS = {
    sponsors: { url: "https://kamiapter.com/sponsors", label: "Sponsor Me", icon: "\ud83d\udc8c" },
    modeling: { url: "https://kamiapter.com/modeling", label: "Modeling Portfolio", icon: "\ud83d\udcf7" },
    visionaries: { url: "https://littlevisionaries-placeholder.org", label: "Little Visionaries", icon: "\ud83d\udc53" },
    alex: { url: "https://www.instagram.com/alexfilmsinc", label: "@alexfilmsinc", icon: "\ud83c\udfa5" }
  };
  var LINKS = Object.assign({}, DEFAULT_LINKS, window.KAMI_LINKS || {});

  var chatOpen = false;
  var chatHistory = [];
  var greeted = false;

  var qrContainer = document.getElementById('kcQuickReplies');
  QUICK_REPLIES.forEach(function (q) {
    var isObj = typeof q === 'object' && q !== null;
    var label = isObj ? q.text : q;
    var icon = isObj ? q.icon : '';
    var btn = document.createElement('button');
    btn.className = 'kc-quick-btn';
    btn.innerHTML = (icon ? '<span class="kc-quick-icon">' + icon + '</span>' : '') + '<span>' + label + '</span>';
    btn.addEventListener('click', function () { quickReply(label); });
    qrContainer.appendChild(btn);
  });

  function toggleChat() {
    chatOpen = !chatOpen;
    document.getElementById('kcWindow').classList.toggle('open', chatOpen);
    document.getElementById('kcSpeechBubble').style.display = chatOpen ? 'none' : '';
    if (chatOpen && !greeted) {
      greeted = true;
      addMsg('kami', "Hey, it's Kami! \ud83d\udc97");
    }
  }

  function formatTime(d) {
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    var mStr = m < 10 ? '0' + m : '' + m;
    return (h < 10 ? '0' + h : '' + h) + ':' + mStr + ' ' + ampm;
  }

  function addMsg(sender, text) {
    var msgs = document.getElementById('kcMessages');
    var div = document.createElement('div');
    div.className = 'kc-msg ' + sender;

    var linkMatch = text.match(/\[LINK:(\w+)\]/);
    var cleanText = text.replace(/\[LINK:\w+\]/, '').trim();

    var row = document.createElement('div');
    row.className = 'kc-msg-row';
    var bubble = document.createElement('div');
    bubble.className = 'kc-msg-bubble';

    var textSpan = document.createElement('div');
    textSpan.textContent = cleanText;
    bubble.appendChild(textSpan);

    if (linkMatch && LINKS[linkMatch[1]]) {
      var info = LINKS[linkMatch[1]];
      var linkWrap;
      if (info.onClick) {
        linkWrap = document.createElement('button');
        linkWrap.type = 'button';
        linkWrap.addEventListener('click', info.onClick);
      } else {
        linkWrap = document.createElement('a');
        linkWrap.href = info.url;
        linkWrap.target = '_blank';
        linkWrap.rel = 'noreferrer';
      }
      linkWrap.className = 'kc-link-pill';
      linkWrap.innerHTML = '<span class="kc-link-icon">' + info.icon + '</span><span>' + info.label + '</span>';
      bubble.appendChild(linkWrap);
    }

    row.appendChild(bubble);
    div.appendChild(row);

    var meta = document.createElement('div');
    meta.className = 'kc-msg-meta';
    var label = sender === 'kami' ? 'Kami \u00b7 AI Agent' : 'You';
    meta.textContent = label + ' \u00b7 ' + formatTime(new Date());
    div.appendChild(meta);

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addTyping() {
    var msgs = document.getElementById('kcMessages');
    var div = document.createElement('div');
    div.className = 'kc-msg kami';
    div.id = 'kcTypingIndicator';
    div.innerHTML = '<div class="kc-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById('kcTypingIndicator');
    if (t) t.remove();
  }

  function hideQuickReplies() {
    var qr = document.getElementById('kcQuickReplies');
    if (qr) qr.style.display = 'none';
  }

  function quickReply(text) {
    document.getElementById('kcInput').value = text;
    sendMsg();
  }

  function sendMsg() {
    var input = document.getElementById('kcInput');
    var text = input.value.trim();
    if (!text) return;
    hideQuickReplies();
    input.value = '';
    addMsg('user', text);
    chatHistory.push({ role: 'user', content: text });
    addTyping();
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 60,
        system: SYSTEM_PROMPT,
        messages: chatHistory
      })
    }).then(function (res) { return res.json(); })
      .then(function (data) {
        var reply = (data.content && data.content[0] && data.content[0].text) || "Sorry, something went wrong! DM me on Instagram!";
        removeTyping();
        addMsg('kami', reply);
        chatHistory.push({ role: 'assistant', content: reply });
      })
      .catch(function () {
        removeTyping();
        addMsg('kami', "Sorry, something glitched. DM me @kamiapter!");
      });
  }

  document.getElementById('kcFaceWrap').addEventListener('click', toggleChat);
  document.getElementById('kcClose').addEventListener('click', toggleChat);
  document.getElementById('kcSend').addEventListener('click', sendMsg);
  document.getElementById('kcInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendMsg();
  });

  window.kamiToggleChat = toggleChat;
})();
