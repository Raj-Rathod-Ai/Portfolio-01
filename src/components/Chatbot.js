/**
 * Personal AI Chatbot Component (Rudra)
 * Powered by Mistral AI LLM with client & backend fallback.
 */

// Dynamically read runtime client API key if configured
const getMistralKey = () => window.MISTRAL_API_KEY || '';

export class Chatbot {
  constructor() {
    this.isOpen = false;
    this.history = [];
    this.isTyping = false;
  }

  /**
   * Render chatbot HTML shell (Floating button + Chat Drawer).
   * @returns {string} HTML markup.
   */
  render() {
    return `
      <!-- Floating Chatbot Trigger Button -->
      <button id="chatbot-toggle-btn"
              class="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/25 hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/20 group"
              title="Chat with Rudra (AI Assistant)" aria-label="Open AI Chatbot">
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 border-2 border-[#0d1117] rounded-full animate-pulse"></span>
        <i class="fa-solid fa-robot text-xl group-hover:rotate-12 transition-transform"></i>
      </button>

      <!-- Floating Chatbot Window -->
      <div id="chatbot-window"
           class="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[530px] max-h-[80vh] z-[60] rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-300 transform scale-90 opacity-0 pointer-events-none"
           style="background: rgba(13, 17, 23, 0.95);">
        
        <!-- Header -->
        <div class="px-5 py-4 border-b border-white/10 bg-white/3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-inner">
              <i class="fa-solid fa-robot text-base"></i>
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-400 border-2 border-[#0d1117] rounded-full"></span>
            </div>
            <div>
              <h4 class="font-jakarta font-bold text-sm text-gray-100 flex items-center gap-1.5">
                Rudra <span class="px-2 py-0.2 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
              </h4>
              <p class="font-mono text-[10px] text-gray-400">Mistral-Powered Assistant</p>
            </div>
          </div>
          
          <button id="chatbot-close-btn" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Chat Stream Body -->
        <div id="chatbot-messages" class="flex-1 overflow-y-auto p-4 space-y-4 font-inter text-xs text-gray-300 leading-relaxed scrollbar-thin">
          <!-- Welcome Message -->
          <div class="flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs shrink-0 mt-0.5">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="bg-white/5 border border-white/8 rounded-2xl rounded-tl-none p-3 max-w-[85%] text-gray-200 shadow-sm">
              <p>Hi! 👋 I'm <strong>Rudra</strong>, Raj Rathod's custom AI Assistant. Ask me anything about Raj's ML/AI projects, technical skills, or education!</p>
            </div>
          </div>

          <!-- Quick Suggestion Chips -->
          <div id="chatbot-quick-chips" class="flex flex-wrap gap-1.5 pt-1 pl-9">
            <button class="chat-chip px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all hover:scale-105" style="background:rgba(99,102,241,0.1);border-color:rgba(99,102,241,0.25);color:#a5b4fc">
              🚀 Top Projects
            </button>
            <button class="chat-chip px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all hover:scale-105" style="background:rgba(20,184,166,0.1);border-color:rgba(20,184,166,0.25);color:#2dd4bf">
              🎓 Education & CGPA
            </button>
            <button class="chat-chip px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all hover:scale-105" style="background:rgba(244,63,94,0.1);border-color:rgba(244,63,94,0.25);color:#fda4af">
              📬 Contact Info
            </button>
          </div>
        </div>

        <!-- Input Bar -->
        <form id="chatbot-form" class="p-3 border-t border-white/10 bg-white/2 flex items-center gap-2">
          <input type="text" id="chatbot-input" placeholder="Ask Rudra about Raj..."
                 class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-primary/60 transition-colors placeholder-gray-500" autocomplete="off">
          <button type="submit" id="chatbot-send-btn"
                  class="w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shrink-0">
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>

      </div>
    `;
  }

  /**
   * Bind events and initialize chatbot logic.
   */
  setup() {
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn  = document.getElementById('chatbot-close-btn');
    const win       = document.getElementById('chatbot-window');
    const form      = document.getElementById('chatbot-form');
    const input     = document.getElementById('chatbot-input');
    const messages  = document.getElementById('chatbot-messages');
    const chips     = document.querySelectorAll('.chat-chip');

    if (!toggleBtn || !win) return;

    const toggleChat = (show) => {
      this.isOpen = typeof show === 'boolean' ? show : !this.isOpen;
      if (this.isOpen) {
        win.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
        win.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
        input?.focus();
      } else {
        win.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
        win.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
      }
    };

    toggleBtn.addEventListener('click', () => toggleChat());
    closeBtn?.addEventListener('click', () => toggleChat(false));

    // Handle Quick Chips
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim().replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*/u, '');
        if (text) this.sendMessage(text);
      });
    });

    // Handle Form Submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val) {
        input.value = '';
        this.sendMessage(val);
      }
    });
  }

  /**
   * Send user message and trigger response stream.
   * @param {string} text - User message string.
   */
  async sendMessage(text) {
    if (this.isTyping) return;
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    // Hide quick chips once chatting starts
    const chipsContainer = document.getElementById('chatbot-quick-chips');
    if (chipsContainer) chipsContainer.style.display = 'none';

    // 1. Append User Message
    this.appendMessage('user', text);
    this.history.push({ role: 'user', content: text });

    // 2. Show Typing Indicator
    this.isTyping = true;
    const typingId = this.showTypingIndicator();

    // 3. Fetch Answer from Backend / Mistral Direct API / Fallback
    try {
      const replyText = await this.getBotReply(text);
      this.removeTypingIndicator(typingId);
      this.appendMessage('bot', replyText);
      this.history.push({ role: 'assistant', content: replyText });
    } catch (err) {
      console.warn('Bot fetch error:', err);
      this.removeTypingIndicator(typingId);
      const fallbackMsg = this.getOfflineFallback(text);
      this.appendMessage('bot', fallbackMsg);
    } finally {
      this.isTyping = false;
    }
  }

  /**
   * Query backend /api/chat endpoint or Mistral direct API.
   * @param {string} prompt 
   * @returns {Promise<string>}
   */
  async getBotReply(prompt) {
    // Attempt 1: Portfolio backend Express API endpoint
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: this.history })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) return data.reply;
      }
    } catch (err) {
      console.log('Backend /api/chat offline. Trying Mistral direct client API...');
    }

    // Attempt 2: Direct Mistral API call
    try {
      const systemPrompt = `You are Rudra, an intelligent, friendly, and professional custom AI Assistant for Raj Rathod's portfolio.
Answer questions naturally and concisely (2-4 sentences max per response unless detail is specifically requested).

RAJ RATHOD'S PROFILE DATA:
- Role: AI & Machine Learning Developer.
- Education: B.Tech in Computer Science & Engineering with AI specialization at Parul University, Vadodara (2023 - 2027). CGPA: 7.66.
- Coding Achievements: Solved 350+ problems on LeetCode.
- Core Technical Skills:
  * Languages: Python, Java, C/C++, SQL, JavaScript, HTML/CSS.
  * AI/ML/DL Frameworks: TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, OpenCV, NLTK, Spacy, Streamlit.
  * Tools: Git/GitHub, Docker, Power BI, Linux CLI, Vercel, Netlify.
- Key Projects:
  1. Flower Disease System: CNN classifier detecting diseases in plant leaves (PyTorch/Streamlit).
  2. Fake News Detection: Real-time NLP text classifier (Scikit-learn/NLTK).
  3. Taxi Price Prediction: Regression models for fare amounts.
  4. Food Delivery Time: Streamlit ML app predicting delivery duration.
  5. Discover Your True Personality: Personality classification model.
  6. Job Analysis Dashboard: Power BI analytics dashboard.
  7. Neuro OS: Creative front-end Web OS concept.
- Certifications:
  1. Data Science & Analytics with GenAI (Sheryians Coding School - Cert ID: 311726923637568120a0faf6, July 2026).
  2. Java Programming Certification.
  3. Prompt Engineering & GenAI Certification.
  4. Python Programming Certification.
  5. Networks & Protocols (NPTEL IIT).
- Contact Details:
  * Email: rathodraj1504@gmail.com
  * GitHub: https://github.com/Raj-Rathod-Ai
  * LinkedIn: https://linkedin.com/in/raj-rathod-ai`;

      const apiMessages = [{ role: 'system', content: systemPrompt }];
      this.history.slice(-4).forEach(h => apiMessages.push(h));
      apiMessages.push({ role: 'user', content: prompt });

      const mRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getMistralKey()}`
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 450
        })
      });

      if (mRes.ok) {
        const mData = await mRes.json();
        const content = mData.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (err) {
      console.log('Mistral direct API failed. Using smart offline rule matcher.');
    }

    return this.getOfflineFallback(prompt);
  }

  /**
   * Offline intelligent rule matching engine for instant responses.
   * @param {string} input 
   * @returns {string}
   */
  getOfflineFallback(input) {
    const text = input.toLowerCase();

    if (text.includes('project') || text.includes('work') || text.includes('build')) {
      return `Raj has built several high-impact AI/ML projects! Key highlights:\n\n` +
             `• **Flower Disease System**: CNN leaf disease classifier.\n` +
             `• **Fake News Detection**: Real-time NLP text classifier.\n` +
             `• **Taxi Price Prediction**: Regression modeling app.\n` +
             `• **Job Analysis Dashboard**: Power BI analytical insights.\n\n` +
             `Check the **Projects** section on the main page to explore all repositories!`;
    }

    if (text.includes('certificat') || text.includes('credential') || text.includes('accreditat')) {
      return `Raj holds several prestigious certifications & accreditations:\n\n` +
             `🏆 **Data Science & Analytics with GenAI** - Sheryians Coding School (Cert ID: 311726923637568120a0faf6)\n` +
             `🏆 **Prompt Engineering & GenAI** - Advanced LLM Tuning\n` +
             `🏆 **Java Programming** - Core OOP & Algorithms\n` +
             `🏆 **Python Programming** - Data Analysis & Scripting\n` +
             `🏆 **Networks & Protocols** - NPTEL IIT\n\n` +
             `You can click **Live Preview** on any certificate in the Certifications section to view it!`;
    }

    if (text.includes('education') || text.includes('cgpa') || text.includes('college') || text.includes('university') || text.includes('degree')) {
      return `Raj is pursuing a **B.Tech in Computer Science & Engineering (AI Specialization)** at **Parul University**, Vadodara (2023 - 2027) with an impressive **7.66 CGPA**. He has also solved **350+ problems on LeetCode**!`;
    }

    if (text.includes('skill') || text.includes('technolog') || text.includes('python') || text.includes('java') || text.includes('stack')) {
      return `Here are Raj's key technical competencies:\n\n` +
             `• **Languages**: Python, Java, C/C++, SQL, JavaScript.\n` +
             `• **AI/ML/DL**: PyTorch, TensorFlow, Scikit-learn, OpenCV, NLTK, Streamlit.\n` +
             `• **Tools**: Git/GitHub, Docker, Power BI, Linux CLI, Vercel, Netlify.`;
    }

    if (text.includes('contact') || text.includes('email') || text.includes('reach') || text.includes('hire') || text.includes('message')) {
      return `You can reach out to Raj directly via:\n\n` +
             `📧 **Email**: rathodraj1504@gmail.com\n` +
             `💻 **GitHub**: [github.com/Raj-Rathod-Ai](https://github.com/Raj-Rathod-Ai)\n` +
             `🔗 **LinkedIn**: [linkedin.com/in/raj-rathod-ai](https://linkedin.com/in/raj-rathod-ai)\n\n` +
             `Or scroll down to the **Contact** section on the website to send a direct message!`;
    }

    return `Raj Rathod is an **AI & Machine Learning Developer** specialized in building intelligent systems, NLP models, and computer vision applications. Feel free to ask about his **projects**, **skills**, **education**, or **contact details**!`;
  }

  /**
   * Append formatted message bubble to chat window.
   */
  appendMessage(sender, text) {
    const container = document.getElementById('chatbot-messages');
    if (!container) return;

    const formattedText = this.formatMarkdown(text);
    const div = document.createElement('div');

    if (sender === 'user') {
      div.className = 'flex items-start justify-end gap-2.5';
      div.innerHTML = `
        <div class="bg-primary/20 border border-primary/40 rounded-2xl rounded-tr-none p-3 max-w-[85%] text-gray-100 shadow-sm">
          <p>${formattedText}</p>
        </div>
        <div class="w-7 h-7 rounded-lg bg-primary/30 border border-primary/50 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
          <i class="fa-solid fa-user"></i>
        </div>
      `;
    } else {
      div.className = 'flex items-start gap-2.5';
      div.innerHTML = `
        <div class="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs shrink-0 mt-0.5">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="bg-white/5 border border-white/8 rounded-2xl rounded-tl-none p-3 max-w-[85%] text-gray-200 shadow-sm space-y-1">
          ${formattedText}
        </div>
      `;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Render typing indicator.
   */
  showTypingIndicator() {
    const container = document.getElementById('chatbot-messages');
    if (!container) return null;

    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'flex items-start gap-2.5';
    div.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs shrink-0 mt-0.5">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="bg-white/5 border border-white/8 rounded-2xl rounded-tl-none px-4 py-3 text-gray-400 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style="animation-delay:0.15s"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style="animation-delay:0.3s"></span>
      </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  /**
   * Basic markdown string formatter for bot output.
   */
  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-primary hover:underline">$1</a>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }
}
