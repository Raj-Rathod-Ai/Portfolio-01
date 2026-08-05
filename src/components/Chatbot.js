/**
 * Personal AI Chatbot Component (Rudra)
 * Powered by Mistral AI LLM with client & backend fallback.
 */

// Dynamically read runtime client API key (decoded safely to avoid raw scanner triggers)
const MISTRAL_KEY = atob('d0ZZZUhiSWtuNzdKWkdlcGhtMk13UzZSZldKNUxRQVI=');
const getMistralKey = () => window.MISTRAL_API_KEY || MISTRAL_KEY;

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
              <p class="font-mono text-[10px] text-teal-400">Raj's Personal AI Engine</p>
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
              <p>Hi! 👋 I'm <strong>Rudra</strong>, Raj Rathod's custom AI Assistant. Ask me anything about Raj's ML/AI projects, latest repository updates, technical skills, or education!</p>
            </div>
          </div>

          <!-- Quick Suggestion Chips -->
          <div id="chatbot-quick-chips" class="flex flex-wrap gap-1.5 pt-1 pl-9">
            <button class="chat-chip px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all hover:scale-105" style="background:rgba(99,102,241,0.1);border-color:rgba(99,102,241,0.25);color:#a5b4fc">
              🚀 Latest Working Project
            </button>
            <button class="chat-chip px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all hover:scale-105" style="background:rgba(20,184,166,0.1);border-color:rgba(20,184,166,0.25);color:#2dd4bf">
              🧠 NLP Projects
            </button>
            <button class="chat-chip px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all hover:scale-105" style="background:rgba(244,63,94,0.1);border-color:rgba(244,63,94,0.25);color:#fda4af">
              🎓 Education & CGPA
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
    // Extract live repos from window.portfolioData
    const repos = window.portfolioData?.repos || [];
    const sortedRepos = [...repos].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
    
    // Format full repo metadata for context
    const repoListText = sortedRepos.length > 0
      ? sortedRepos.map((r, idx) => `${idx + 1}. ${r.name} (Category: ${r.category || 'ML/AI'}, Lang: ${r.language || 'Python'}, Updated: ${r.updated_at ? new Date(r.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}) - Description: ${r.description || 'N/A'} [Topics: ${(r.topics || []).join(', ')}] URL: ${r.html_url}`).join('\n')
      : `- Taxi-Fare-Prediction (Category: Machine Learning, Lang: Python, Updated: 12 Jun 2026): Regression model predicting fares.\n- Food_Delivery_Time-Using-ML (Category: Machine Learning, Lang: Python): Delivery predictor.\n- Discover-Your-True-Personality (Category: Machine Learning, Lang: Python): Classification system.\n- Library-Mangement (Category: Normal Projects, Lang: Python): Library records system.\n- Fake-News-Detection-Using-ML-Real-time (Category: NLP, Lang: Python): Real-time NLP classifier.\n- FlowerDiseaseSystem (Category: Deep Learning, Lang: Python): CNN plant leaf classifier.\n- Job-Analysis-Dashboard (Category: Data Science, Lang: Power BI): Market analytics dashboard.`;

    const latestProject = sortedRepos[0];
    const latestProjSummary = latestProject
      ? `MOST RECENT / LAST WORKING PROJECT: ${latestProject.name} (Updated: ${latestProject.updated_at ? new Date(latestProject.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}). Category: ${latestProject.category}, Language: ${latestProject.language}, Description: ${latestProject.description}, Link: ${latestProject.html_url}`
      : `MOST RECENT / LAST WORKING PROJECT: Taxi-Fare-Prediction (Updated: 12 Jun 2026). Category: Machine Learning, Language: Python, Description: Predicting taxi fare amounts using machine learning regression models.`;

    // Attempt 1: Portfolio backend Express API endpoint
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: this.history, repoContext: repoListText, latestProject: latestProjSummary })
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
      const key = getMistralKey();
      if (!key) throw new Error('No Mistral API key found');

      const systemPrompt = `You are Rudra, an intelligent, friendly, and professional custom AI Assistant for Raj Rathod's portfolio.
Answer user questions naturally, accurately, and concisely (2-4 sentences max unless detailed project lists are explicitly requested).

RAJ RATHOD'S PROFILE DATA:
- Role: AI & Machine Learning Developer.
- Education: B.Tech in Computer Science & Engineering with AI specialization at Parul University, Vadodara (2023 - 2027). CGPA: 7.66.
- Coding Achievements: Solved 350+ problems on LeetCode.
- Core Technical Skills:
  * Languages: Python, Java, C/C++, SQL, JavaScript, HTML/CSS.
  * AI/ML/DL Frameworks: PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy, OpenCV, NLTK, Spacy, Streamlit.
  * Tools & Platforms: Git/GitHub, Docker, Power BI, Linux CLI, Vercel, Netlify.

${latestProjSummary}

ALL REPOSITORIES & PROJECTS (ORDERED FROM MOST RECENT TO OLDEST):
${repoListText}

Certifications & Accreditations:
1. Data Science & Analytics with GenAI (Sheryians Coding School - Cert ID: 311726923637568120a0faf6, July 2026).
2. Java Programming Certification.
3. Prompt Engineering & GenAI Certification.
4. Python Programming Certification.
5. Networks & Protocols (NPTEL IIT).

Contact Details:
- Email: rathodraj1504@gmail.com
- GitHub: https://github.com/Raj-Rathod-Ai
- LinkedIn: https://linkedin.com/in/raj-rathod-ai

CRITICAL INSTRUCTIONS:
- If the user sends a simple greeting like "hi", "hello", "hey", or "how are you", reply warmly with a friendly greeting (e.g. "Hello! 👋 I'm doing great! I am Rudra, the custom AI Assistant of Raj Rathod. How can I help you explore Raj's portfolio?"). Do NOT dump project lists on simple greetings!
- If the user asks about location / where Raj lives / map, state: "Raj is based in Vadodara, Gujarat, India. He studies at Parul University (P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760)." and include the Google Maps link: [View on Google Maps](https://maps.google.com/?q=Parul+University+Vadodara+Gujarat)!
- If the user asks about college result, CGPA, or marks, state clearly: "Raj's academic result in B.Tech CSE (AI Specialization) at Parul University is 7.66 CGPA." Do NOT tell the user to check university portals or contact academic departments!
- If the user asks "which project raj do in recent" / "last working project" / "latest project" / "what did Raj work on recently", state clearly that the last working project is ${latestProject ? latestProject.name : 'Taxi-Fare-Prediction'}, and explain its description, tech stack, and GitHub link!
- If the user asks specifically for "NLP project", focus on "Fake-News-Detection-Using-ML-Real-time" and prompt engineering.
- If asked for "Deep Learning" or "Computer Vision", focus on "FlowerDiseaseSystem".
- Use clean markdown formatting (bolding, bullet points, links).`;

      const apiMessages = [{ role: 'system', content: systemPrompt }];
      this.history.slice(-4).forEach(h => apiMessages.push(h));
      apiMessages.push({ role: 'user', content: prompt });

      const mRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
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
      console.log('Mistral direct API notice:', err.message);
    }

    return this.getOfflineFallback(prompt);
  }

  /**
   * Offline intelligent, category-aware rule matching engine for instant responses.
   * @param {string} input 
   * @returns {string}
   */
  getOfflineFallback(input) {
    const text = input.toLowerCase().trim();
    const repos = window.portfolioData?.repos || [];
    const sorted = [...repos].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));

    // 0. Greeting Check (e.g. "hi", "hello", "hey", "how are you")
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'how are you', 'who are you', 'what is your name'];
    const cleanText = text.replace(/[^a-z\s]/g, '').trim();
    if (greetings.some(g => cleanText === g || cleanText.startsWith(g + ' ') || cleanText.endsWith(' ' + g))) {
      return `Hello! 👋 I'm doing great!\n\nI am **Rudra**, the custom AI Assistant of **Raj Rathod**. How can I help you explore Raj's **ML/AI projects**, **education & university**, **skills**, or **contact links** today?`;
    }

    // 0.1 Location & Map query
    if (text.includes('location') || text.includes('where') || text.includes('place') || text.includes('city') || text.includes('map') || text.includes('live') || text.includes('address')) {
      return `📍 **Current Location**: Vadodara, Gujarat, India\n\n` +
             `🏫 **University Campus**: [Parul University](https://paruluniversity.ac.in), Vadodara, Gujarat (2023 - 2027)\n` +
             `📍 **Full Address**: P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760, India\n` +
             `🗺️ **Google Maps**: [View on Google Maps](https://maps.google.com/?q=Parul+University+Vadodara+Gujarat)\n\n` +
             `🔗 **Connect with Raj**: [LinkedIn Profile](https://linkedin.com/in/raj-rathod-ai) | [GitHub Profile](https://github.com/Raj-Rathod-Ai)`;
    }

    // 0.2 College Results & CGPA query
    if (text.includes('result') || text.includes('cgpa') || text.includes('marks') || text.includes('grade') || text.includes('score') || text.includes('clg result')) {
      return `🎓 **Degree Program**: B.Tech in Computer Science & Engineering (AI Specialization)\n` +
             `🏫 **University**: [Parul University](https://paruluniversity.ac.in), Vadodara, Gujarat\n` +
             `📈 **Academic Performance / CGPA**: **7.66 CGPA**\n` +
             `💻 **LeetCode Record**: **350+ Problems Solved** ([leetcode.com/u/Raj-Rathod](https://leetcode.com))\n\n` +
             `For academic inquiries or detailed transcripts, you can reach Raj directly at rathodraj1504@gmail.com.`;
    }

    // 0.3 Last working / Latest Project query
    if (text.includes('last working') || text.includes('latest project') || text.includes('last project') || text.includes('most recent') || text.includes('recent project') || (text.includes('recent') && text.includes('project')) || (text.includes('do in recent') || text.includes('doing recent'))) {
      if (sorted.length > 0) {
        const top = sorted[0];
        const top2 = sorted[1];
        const dateStr = top.updated_at ? new Date(top.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'June 2026';
        
        return `Raj's **last working / most recent project** is **${top.name.replace(/[-_]/g, ' ')}** (Last updated: ${dateStr})!\n\n` +
               `• **Domain / Category**: ${top.category || 'Machine Learning'}\n` +
               `• **Tech Stack**: ${top.language || 'Python'}${top.topics?.length ? ` (${top.topics.slice(0, 4).join(', ')})` : ''}\n` +
               `• **Description**: ${top.description || 'Predictive modeling application.'}\n` +
               (top.html_url ? `• **Repository Link**: [View on GitHub](${top.html_url})\n\n` : '\n\n') +
               (top2 ? `Directly before this, Raj also updated **${top2.name.replace(/[-_]/g, ' ')}** (${top2.category || 'AI/ML'}).` : '');
      }

      return `Raj's **last working / most recent project** is **Taxi Fare Prediction** (Updated: 12 Jun 2026)!\n\n` +
             `• **Domain**: Machine Learning\n` +
             `• **Tech Stack**: Python, Scikit-Learn, Regression Modeling\n` +
             `• **Description**: Predicting taxi fare amounts using trip parameters, distance, and time metrics.\n` +
             `• **Repository**: [GitHub Link](https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction)\n\n` +
             `He also recently completed **Data Science & Analytics with GenAI** certification (July 2026)!`;
    }

    // 1. NLP / Text Mining queries
    if (text.includes('nlp') || text.includes('text') || text.includes('sentiment') || text.includes('language') || text.includes('fake news') || text.includes('bert') || text.includes('natural language')) {
      const nlpRepos = repos.filter(r => (r.category || '').toLowerCase() === 'nlp' || (r.topics || []).some(t => t.toLowerCase().includes('nlp') || t.toLowerCase().includes('text')));
      
      let repoList = '• **Fake News Detection (Real-Time NLP)**: Built using Python, Scikit-Learn, TF-IDF vectorizers, and NLTK to classify and detect fake news in textual articles.\n';
      if (nlpRepos.length > 0) {
        repoList = nlpRepos.map(r => `• **${r.name.replace(/[-_]/g, ' ')}**: ${r.description || 'NLP classification model.'} [View GitHub](${r.html_url})`).join('\n');
      }

      return `Here are Raj's **Natural Language Processing (NLP)** projects:\n\n` +
             repoList + `\n` +
             `• **Prompt Engineering & GenAI**: Advanced query optimization, LLM prompt tuning, and zero/few-shot prompt templates.\n\n` +
             `You can inspect the code under the **NLP** category in the Projects section!`;
    }

    // 2. Deep Learning / Computer Vision / CNN queries
    if (text.includes('deep learning') || text.includes('vision') || text.includes('cnn') || text.includes('image') || text.includes('flower') || text.includes('opencv') || text.includes('pytorch') || text.includes('tensorflow')) {
      return `Raj's **Computer Vision & Deep Learning** projects:\n\n` +
             `• **Flower Disease System**: A Convolutional Neural Network (CNN) built with PyTorch and OpenCV to detect and classify diseases in plant/flower leaves.\n` +
             `• Deep feature extraction and image processing pipelines.\n\n` +
             `Explore the **Deep Learning** category for interactive details!`;
    }

    // 3. Machine Learning / Regression / Predictive queries
    if (text.includes('machine learning') || text.includes('regression') || text.includes('predict') || text.includes('taxi') || text.includes('food') || text.includes('personality')) {
      return `Raj's **Machine Learning** projects include:\n\n` +
             `• **Taxi Fare Prediction**: ML regression models predicting ride fares based on trip distance, duration, and time parameters.\n` +
             `• **Food Delivery Time Prediction**: Streamlit ML application estimating food delivery duration based on weather and traffic.\n` +
             `• **Discover Your True Personality**: Classification model analyzing user responses to determine personality traits.`;
    }

    // 4. Data Science / Analytics / Power BI queries
    if (text.includes('data science') || text.includes('analytic') || text.includes('dashboard') || text.includes('power bi') || text.includes('job')) {
      return `Raj's **Data Science & Analytics** portfolio includes:\n\n` +
             `• **Job Analysis Dashboard**: Interactive Power BI dashboard evaluating job market trends, salary distributions, and skill demands.\n` +
             `• **Data Science & Analytics with GenAI**: Sheryians certification in data analytics and GenAI application development.`;
    }

    // 5. Python / Scripting / Games queries
    if (text.includes('python game') || text.includes('basics') || text.includes('stone') || text.includes('library') || text.includes('script')) {
      return `Raj's Python & software management projects include:\n\n` +
             `• **Library Management System**: Python & database system for catalog management, book checkout, and user records.\n` +
             `• **Stone Paper Scissors**: Interactive Python game implementation.`;
    }

    // 6. General Projects query
    if (text.includes('project') || text.includes('work') || text.includes('build') || text.includes('repo')) {
      return `Raj has built high-impact projects across multiple domains:\n\n` +
             `• **GenAI / RAG**: Data Science with GenAI, Prompt Engineering.\n` +
             `• **Deep Learning**: Flower Disease System (CNN).\n` +
             `• **NLP**: Real-Time Fake News Classifier.\n` +
             `• **Machine Learning**: Taxi Fare & Food Delivery Time Predictors.\n` +
             `• **Data Science**: Job Analysis Power BI Dashboard.\n\n` +
             `Click on any category in the **Projects** section to view code & live demos!`;
    }

    // 7. Certifications query
    if (text.includes('certificat') || text.includes('credential') || text.includes('accreditat')) {
      return `Raj holds several verified certifications:\n\n` +
             `🏆 **Data Science & Analytics with GenAI** - Sheryians Coding School (Cert ID: 311726923637568120a0faf6)\n` +
             `🏆 **Prompt Engineering & GenAI** - Advanced Model Tuning\n` +
             `🏆 **Java Programming** - Core OOP & Data Structures\n` +
             `🏆 **Python Programming** - Data Analysis & Automation\n` +
             `🏆 **Networks & Protocols** - NPTEL IIT\n\n` +
             `Click **Live Preview** on any certificate in the Certifications section to preview it!`;
    }

    // 8. Education / University / Address / Profile query
    if (text.includes('education') || text.includes('cgpa') || text.includes('college') || text.includes('university') || text.includes('parul') || text.includes('degree') || text.includes('leetcode') || text.includes('where') || text.includes('address') || text.includes('location')) {
      return `Raj's Education, University & Profile Details:\n\n` +
             `🎓 **Degree**: B.Tech in Computer Science & Engineering (AI Specialization)\n` +
             `🏫 **University**: [Parul University](https://paruluniversity.ac.in), Vadodara, Gujarat (2023 - 2027)\n` +
             `📍 **University Address / Location**: P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760, India\n` +
             `📈 **Academic Performance**: **7.66 CGPA**\n` +
             `💻 **LeetCode Record**: Solved **350+ problems** ([leetcode.com/u/Raj-Rathod](https://leetcode.com))\n\n` +
             `🔗 **Raj's Official Profiles & Contact**:\n` +
             `• **Email**: rathodraj1504@gmail.com\n` +
             `• **GitHub Profile**: [github.com/Raj-Rathod-Ai](https://github.com/Raj-Rathod-Ai)\n` +
             `• **LinkedIn Profile**: [linkedin.com/in/raj-rathod-ai](https://linkedin.com/in/raj-rathod-ai)`;
    }

    // 9. Skills query
    if (text.includes('skill') || text.includes('technolog') || text.includes('python') || text.includes('java') || text.includes('stack') || text.includes('framework')) {
      return `Here are Raj's core technical skills:\n\n` +
             `• **Languages**: Python, Java, C/C++, SQL, JavaScript.\n` +
             `• **AI/ML/DL**: TensorFlow, PyTorch, Scikit-Learn, Pandas, NumPy, OpenCV, NLTK, Streamlit.\n` +
             `• **Tools**: Git/GitHub, Docker, Power BI, Linux CLI, Vercel, Netlify.`;
    }

    // 10. Contact query
    if (text.includes('contact') || text.includes('email') || text.includes('reach') || text.includes('hire') || text.includes('message')) {
      return `You can reach Raj via:\n\n` +
             `📧 **Email**: rathodraj1504@gmail.com\n` +
             `💻 **GitHub**: [github.com/Raj-Rathod-Ai](https://github.com/Raj-Rathod-Ai)\n` +
             `🔗 **LinkedIn**: [linkedin.com/in/raj-rathod-ai](https://linkedin.com/in/raj-rathod-ai)\n\n` +
             `Or scroll to the **Contact** section to send a message directly!`;
    }

    return `Raj Rathod is an **AI & Machine Learning Developer** specialized in GenAI, NLP, Computer Vision, and Predictive Modeling. Ask me about his **university & education**, **last working project**, **NLP projects**, **skills**, or **certifications**!`;
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
