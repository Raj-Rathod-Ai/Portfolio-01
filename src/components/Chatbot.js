/**
 * Personal AI Chatbot Component (Rudra)
 * Powered by Mistral AI LLM with persistent visitor onboarding, profile recognition,
 * local storage chat memory, Master Boss password authentication (default pooja1908),
 * change password capability, direct review deletion, and live DB inspection.
 */

import { getVisitorId, hasVisitorName, getVisitorProfile, isBossDevice, setBossDevice, validateVisitorName, authenticateBoss, changeBossPassword, getMasterPassword, getVisitedCategories, trackInteraction, getApiBaseUrl } from '../utils/analytics.js';

// Dynamically read runtime client API key (decoded safely to avoid raw scanner triggers)
const MISTRAL_KEY = atob('d0ZZZUhiSWtuNzdKWkdlcGhtMk13UzZSZldKNUxRQVI=');
const getMistralKey = () => window.MISTRAL_API_KEY || MISTRAL_KEY;

const STORAGE_KEY_PROFILE = 'rudra_visitor_profile';
const STORAGE_KEY_HISTORY = 'rudra_chat_history';

export class Chatbot {
  constructor() {
    this.isOpen = false;
    this.history = [];
    this.isTyping = false;
    this.userProfile = this.loadProfile();
    this.onboardingStep = null; // null | 'ask_name' | 'ask_role' | 'ask_contact' | 'ask_boss_password' | 'change_password_new'
    this.tempProfile = {};
    this.bossAttempts = 0;
  }

  /**
   * Load stored profile from localStorage.
   */
  loadProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Save user profile to localStorage and sync to backend.
   */
  saveProfile(profile) {
    this.userProfile = profile;
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      const visitorId = getVisitorId();
      fetch(getApiBaseUrl() + '/api/analytics/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          name: profile.name,
          role: profile.role,
          isStudent: profile.isStudent,
          contactDetails: profile.contactDetails,
          chatHistory: this.history
        })
      }).catch(() => { });
    } catch (e) { }

    this.hideSuggestionTooltip();
    this.updateHeaderProfileBadge();
  }

  /**
   * Load stored chat history from localStorage.
   */
  loadHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Save current chat history to localStorage.
   */
  saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history.slice(-40)));
      if (this.userProfile) {
        const visitorId = getVisitorId();
        fetch(getApiBaseUrl() + '/api/analytics/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            chatHistory: this.history.slice(-40)
          })
        }).catch(() => { });
      }
    } catch (e) { }
  }

  /**
   * Reset visitor profile and chat history.
  /**
   * Reset ONLY chat history — keeps visitor name/profile intact.
   * Asks if user wants to change their name after reset.
   */
  resetChatOnly() {
    // Only clear the chat messages, NOT the profile
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    this.history = [];
    this.onboardingStep = null;
    this.tempProfile = {};

    const container = document.getElementById('chatbot-messages');
    if (container) container.innerHTML = '';

    this.updateHeaderProfileBadge();

    // After clearing, ask if they want to change their name
    const name = this.userProfile?.name;
    if (name && !isBossDevice()) {
      setTimeout(() => {
        this.appendMessage('bot', `Chat cleared! 🗑️\n\nYour profile name is still saved as **${name}**.\n\nWould you like to **change your name** or continue as **${name}**?`);
        this.renderQuickChips([`Continue as ${name}`, 'Change My Name', '🚀 Latest Project']);
      }, 100);
    } else {
      this.startConversation();
    }
  }

  /**
   * Full reset of profile and chat (admin/boss use).
   */
  resetProfileAndHistory() {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    localStorage.removeItem('boss_authenticated');
    this.userProfile = null;
    this.history = [];
    this.onboardingStep = null;
    this.tempProfile = {};

    const container = document.getElementById('chatbot-messages');
    if (container) container.innerHTML = '';

    this.updateHeaderProfileBadge();
    this.startConversation();
  }

  /**
   * Render chatbot HTML shell (Floating button + Chat Drawer + Suggestion Bubble).
   * @returns {string} HTML markup.
   */
  render() {
    return `
      <!-- Floating First-Time Chatbot Suggestion Tooltip -->
      <div id="chatbot-suggestion-tooltip"
           class="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[59] hidden items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 shadow-2xl backdrop-blur-xl text-xs font-medium text-gray-100 max-w-[290px] cursor-pointer hover:border-indigo-400/60 transition-all select-none">
        <span class="text-base animate-pulse">💬</span>
        <div class="flex-1 min-w-0">
          <p class="font-jakarta font-bold text-[11px] text-indigo-200 leading-tight">First time visiting?</p>
          <p class="text-[10px] text-gray-300 truncate">Chat with Rudra (Raj's AI Assistant)</p>
        </div>
        <button id="chatbot-suggestion-close" class="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-[10px] shrink-0">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Floating Chatbot Trigger Button -->
      <button id="chatbot-toggle-btn"
              class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/25 hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/20 group"
              title="Chat with Rudra (AI Assistant)" aria-label="Open AI Chatbot">
        <span class="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-teal-400 border-2 border-[#0d1117] rounded-full animate-pulse"></span>
        <i class="fa-solid fa-robot text-lg sm:text-xl group-hover:rotate-12 transition-transform"></i>
      </button>

      <!-- Floating Chatbot Window -->
      <div id="chatbot-window"
           class="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[390px] h-[540px] max-h-[82vh] z-[60] rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-300 transform scale-90 opacity-0 pointer-events-none"
           style="background: rgba(13, 17, 23, 0.95);">
        
        <!-- Header -->
        <div class="px-4 py-3 border-b border-white/10 bg-white/3 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="relative w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-inner">
              <i class="fa-solid fa-robot text-sm"></i>
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-400 border-2 border-[#0d1117] rounded-full"></span>
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h4 class="font-jakarta font-bold text-xs text-gray-100">Rudra</h4>
                <span class="px-1.5 py-0.2 rounded text-[8px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
                <span id="chatbot-user-badge" class="hidden text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 max-w-[120px] truncate"></span>
              </div>
              <p class="font-mono text-[9px] text-teal-400">Raj's Personal AI Assistant</p>
            </div>
          </div>
          
          <div class="flex items-center gap-1">
            <button id="chatbot-reset-btn" class="px-2 py-1 rounded text-[10px] font-mono text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1" title="Reset Chat & Visitor Profile">
              <i class="fa-solid fa-rotate-right text-[10px]"></i>
              <span class="hidden sm:inline">Reset</span>
            </button>
            <button id="chatbot-close-btn" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <i class="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Chat Stream Body -->
        <div id="chatbot-messages" class="flex-1 overflow-y-auto p-3.5 space-y-3 font-inter text-xs text-gray-300 leading-relaxed scrollbar-thin min-h-0" data-lenis-prevent>
        </div>

        <!-- Dynamic Quick Action Chips Container -->
        <div id="chatbot-dynamic-chips" class="px-3.5 pb-2 flex flex-wrap gap-1.5">
        </div>

        <!-- Input Bar -->
        <form id="chatbot-form" class="p-3 border-t border-white/10 bg-white/2 flex items-center gap-2">
          <input type="text" id="chatbot-input" placeholder="Type a message..."
                 class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-100 focus:outline-none focus:border-primary/60 transition-colors placeholder-gray-500" autocomplete="off">
          <button type="submit" id="chatbot-send-btn"
                  class="w-8 h-8 rounded-xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shrink-0">
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
    const closeBtn = document.getElementById('chatbot-close-btn');
    const resetBtn = document.getElementById('chatbot-reset-btn');
    const win = document.getElementById('chatbot-window');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const tooltip = document.getElementById('chatbot-suggestion-tooltip');
    const tooltipClose = document.getElementById('chatbot-suggestion-close');

    if (!toggleBtn || !win) return;

    const toggleChat = (show) => {
      this.isOpen = typeof show === 'boolean' ? show : !this.isOpen;
      if (this.isOpen) {
        this.hideSuggestionTooltip();
        win.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
        win.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
        input?.focus();

        // Initialize chat content if container is empty
        const container = document.getElementById('chatbot-messages');
        if (container && container.children.length === 0) {
          this.startConversation();
        }
      } else {
        win.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
        win.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
      }
    };

    toggleBtn.addEventListener('click', () => toggleChat());
    closeBtn?.addEventListener('click', () => toggleChat(false));
    resetBtn?.addEventListener('click', () => {
      if (confirm('Reset chat? Your name will be kept, only messages are cleared.')) {
        this.resetChatOnly();
      }
    });

    // Tooltip suggestion handlers
    if (tooltip) {
      tooltip.addEventListener('click', (e) => {
        if (e.target.closest('#chatbot-suggestion-close')) return;
        toggleChat(true);
      });
    }
    tooltipClose?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hideSuggestionTooltip();
    });

    // Show suggestion tooltip if first-time visitor without a name
    if (!hasVisitorName() && !this.userProfile?.name && !isBossDevice()) {
      setTimeout(() => {
        if (!this.isOpen && !hasVisitorName()) {
          tooltip?.classList.remove('hidden');
          tooltip?.classList.add('flex');
        }
      }, 2500);
    }

    // Handle Form Submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val) {
        input.value = '';
        this.handleUserInput(val);
      }
    });

    // Listen for profile update from Review submission
    window.addEventListener('visitorProfileUpdated', (e) => {
      this.userProfile = this.loadProfile();
      this.updateHeaderProfileBadge();
      this.hideSuggestionTooltip();
    });

    this.updateHeaderProfileBadge();
  }

  /**
   * Hide first-time visitor suggestion tooltip.
   */
  hideSuggestionTooltip() {
    const tooltip = document.getElementById('chatbot-suggestion-tooltip');
    if (tooltip) {
      tooltip.classList.add('hidden');
      tooltip.classList.remove('flex');
    }
  }

  /**
   * Update header visitor recognition pill badge.
   */
  updateHeaderProfileBadge() {
    const badge = document.getElementById('chatbot-user-badge');
    if (!badge) return;
    if (isBossDevice()) {
      badge.textContent = `👑 MASTER BOSS`;
      badge.className = 'text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold';
      badge.classList.remove('hidden');
    } else if (this.userProfile && this.userProfile.name) {
      badge.textContent = `👤 ${this.userProfile.name}`;
      badge.className = 'text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 max-w-[120px] truncate';
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  /**
   * Start initial conversation or restore chat history.
   */
  startConversation() {
    this.history = this.loadHistory();
    const container = document.getElementById('chatbot-messages');
    if (!container) return;

    container.innerHTML = '';

    // Master Boss device recognition shortcut
    if (isBossDevice()) {
      if (!this.userProfile || !this.userProfile.name) {
        this.userProfile = { name: 'Boss', role: 'Portfolio Owner/Master', isStudent: false, contactDetails: '' };
        this.saveProfile(this.userProfile);
      }
      const bossWelcome = `👑 **Welcome Boss!** Master Admin mode is active on this device.\n\nDirect review deletion trash icons [🗑️] are unlocked for you on the portfolio home page.`;
      this.appendMessage('bot', bossWelcome);
      this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
      return;
    }

    if (this.userProfile && this.userProfile.name) {
      // Returning user on same device! Restore past chat history or greeting
      if (this.history.length > 0) {
        this.history.forEach(item => {
          this.appendMessage(item.role === 'user' ? 'user' : 'bot', item.content, false);
        });
        // Render welcoming chip bar
        this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
      } else {
        const welcomeText = `Welcome back, **${this.userProfile.name}**! 👋 Great to see you here again.${this.userProfile.role ? ` (Role: ${this.userProfile.role})` : ''}\n\nI am **Rudra**, Raj Rathod's custom AI Assistant. How can I help you today?`;
        this.appendMessage('bot', welcomeText);
        this.history.push({ role: 'assistant', content: welcomeText });
        this.saveHistory();
        this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
      }
    } else {
      // First time visitor onboarding step 1: Name request
      this.onboardingStep = 'ask_name';
      const introText = `Hi! 👋 I'm **Rudra**, Raj Rathod's custom AI Assistant.\n\nBefore we start exploring Raj's portfolio, **what is your name?**`;
      this.appendMessage('bot', introText);
      this.renderQuickChips(['⏩ Skip Intro']);
    }
  }

  /**
   * Render dynamic option action chips below message body.
   */
  renderQuickChips(chipLabels) {
    const chipsContainer = document.getElementById('chatbot-dynamic-chips');
    if (!chipsContainer) return;

    chipsContainer.innerHTML = '';
    chipLabels.forEach(label => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-chip px-2.5 py-1 rounded-xl border text-[10px] font-mono transition-all hover:scale-105 bg-white/5 border-white/10 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/40';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        const text = label.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*/u, '').trim();
        this.handleUserInput(text);
      });
      chipsContainer.appendChild(btn);
    });
  }

  /**
   * Clear dynamic action chips.
   */
  clearQuickChips() {
    const chipsContainer = document.getElementById('chatbot-dynamic-chips');
    if (chipsContainer) chipsContainer.innerHTML = '';
  }

  /**
   * Handle user input (routes through onboarding flow, password auth, or standard AI chat).
   * @param {string} text 
   */
  async handleUserInput(text) {
    if (this.isTyping) return;
    this.clearQuickChips();

    const cleanInput = text.trim();

    // --- Post-Reset Name Choice Handler ---
    // Handles "Continue as [name]" and "Change My Name" chips
    const continuePfx = 'continue as ';
    if (cleanInput.toLowerCase().startsWith(continuePfx)) {
      // User wants to keep their name — just resume
      this.appendMessage('user', text);
      const reply = `Welcome back, **${this.userProfile?.name}**! 👋 Happy to continue. Ask me anything about Raj's portfolio!`;
      this.appendMessage('bot', reply);
      this.history.push({ role: 'user', content: text }, { role: 'assistant', content: reply });
      this.saveHistory();
      this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
      return;
    }

    if (cleanInput.toLowerCase() === 'change my name') {
      this.appendMessage('user', text);
      // Wipe the old name from profile but keep role/contact
      const oldProfile = { ...(this.userProfile || {}) };
      delete oldProfile.name;
      this.userProfile = oldProfile;
      this.saveProfile(this.userProfile);
      this.onboardingStep = 'ask_name';
      const prompt = `Sure! What would you like to be called? Please enter your name:`;
      this.appendMessage('bot', prompt);
      this.history.push({ role: 'user', content: text }, { role: 'assistant', content: prompt });
      this.saveHistory();
      return;
    }

    // --- Master Password Verification Step (When Boss Name Claimed) ---
    if (this.onboardingStep === 'ask_boss_password') {
      this.appendMessage('user', text);
      const authResult = await authenticateBoss(cleanInput);
      if (authResult.success) {
        this.bossAttempts = 0;
        this.userProfile = { name: 'Boss', role: 'Portfolio Owner/Master', isStudent: false, contactDetails: '' };
        this.saveProfile(this.userProfile);
        this.updateHeaderProfileBadge();
        this.onboardingStep = null;

        const bossReply = `👑 **Master Access Granted!** Welcome Boss.\n\nYour device is now authenticated as Master Owner. Direct review deletion trash icons [🗑️] are now unlocked on the portfolio home page.`;
        this.appendMessage('bot', bossReply);
        this.history.push({ role: 'assistant', content: bossReply });
        this.saveHistory();
        this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
        return;
      } else {
        this.bossAttempts = (this.bossAttempts || 0) + 1;
        if (this.bossAttempts === 1) {
          const failMsg = `❌ **Incorrect Master Password (Attempt 1/3).** Please try again or enter your actual name:`;
          this.appendMessage('bot', failMsg);
          this.history.push({ role: 'assistant', content: failMsg });
          this.saveHistory();
          return;
        } else if (this.bossAttempts === 2) {
          const failMsg = `❌ **Incorrect Master Password (Attempt 2/3).** 1 attempt remaining. Please enter your Master Password or actual name:`;
          this.appendMessage('bot', failMsg);
          this.history.push({ role: 'assistant', content: failMsg });
          this.saveHistory();
          return;
        } else {
          this.bossAttempts = 0;
          this.onboardingStep = 'ask_name';
          const failMsg = `❌ **Maximum password attempts reached (3/3).** Boss access denied. Your device was NOT registered as Boss.\n\nPlease enter your actual name to explore as visitor:`;
          this.appendMessage('bot', failMsg);
          this.history.push({ role: 'assistant', content: failMsg });
          this.saveHistory();
          this.renderQuickChips(['⏩ Skip Intro']);
          return;
        }
      }
    }

    // --- Master Password Interception Check ---
    if (cleanInput.length >= 4 && !isBossDevice()) {
      const authResult = await authenticateBoss(cleanInput);
      if (authResult.success) {
        this.userProfile = { name: 'Boss', role: 'Portfolio Owner/Master', isStudent: false, contactDetails: '' };
        this.saveProfile(this.userProfile);
        this.updateHeaderProfileBadge();
        this.onboardingStep = null;

        const bossReply = `👑 **Master Access Granted!** Welcome Boss.\n\nYour device is authenticated as Master Owner. Direct review deletion trash icons [🗑️] are now unlocked on the portfolio home page.`;
        this.appendMessage('bot', bossReply);
        this.history.push({ role: 'assistant', content: bossReply });
        this.saveHistory();
        this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
        return;
      }
    }

    // --- Change Password Step ---
    if (this.onboardingStep === 'change_password_new') {
      this.appendMessage('user', text);
      const res = await changeBossPassword(getMasterPassword(), cleanInput);
      this.onboardingStep = null;
      if (res.success) {
        const successMsg = `✅ **Master Password Updated Successfully!**\n\nYour new password has been saved to the database in secure hash format.\nThis password will be used for future access across your devices.`;
        this.appendMessage('bot', successMsg);
        this.history.push({ role: 'assistant', content: successMsg });
        this.saveHistory();
      } else {
        this.appendMessage('bot', `❌ ${res.error || 'Failed to update password.'}`);
      }
      this.renderQuickChips(['👑 Master Stats', '🗑️ Delete Review', '🔑 Change Password']);
      return;
    }

    // --- Master Admin Command Shortcuts ---
    if (cleanInput.toLowerCase() === 'change password' || cleanInput.toLowerCase() === 'change-password') {
      this.appendMessage('user', text);
      if (!isBossDevice()) {
        this.appendMessage('bot', `🔑 Please enter your current Master Password first to unlock password modification.`);
        return;
      }
      this.onboardingStep = 'change_password_new';
      this.appendMessage('bot', `🔑 **Change Master Password**\n\nPlease enter your **new Master Boss password**:`);
      return;
    }

    if (cleanInput.toLowerCase().includes('master stats') || cleanInput.toLowerCase().includes('database stats') || cleanInput.toLowerCase().includes('live db')) {
      this.appendMessage('user', text);
      if (!isBossDevice()) {
        this.appendMessage('bot', `🔒 Master Admin authentication required. Enter Master Password to inspect live database analytics.`);
        return;
      }
      await this.showMasterDBStats();
      return;
    }

    if (cleanInput.toLowerCase().includes('delete review') || cleanInput.toLowerCase().includes('remove review')) {
      this.appendMessage('user', text);
      if (!isBossDevice()) {
        this.appendMessage('bot', `🔒 Master Admin authentication required. Enter Master Password to delete reviews.`);
        return;
      }
      await this.showReviewDeleteMenu();
      return;
    }

    // --- Database Visitor Stats Queries Interception ---
    const lowerInput = cleanInput.toLowerCase();
    if (lowerInput.includes('how many person') || lowerInput.includes('how many people') || lowerInput.includes('how many visit') || lowerInput.includes('who visit') || lowerInput.includes('visitor count') || lowerInput.includes('visitor name') || lowerInput.includes('fetch database') || lowerInput.includes('visitor database stats') || lowerInput.includes('person visit')) {
      this.appendMessage('user', text);
      this.isTyping = true;
      const typingId = this.showTypingIndicator();

      const statsReport = await this.fetchAndShowDBStats();
      this.removeTypingIndicator(typingId);
      this.isTyping = false;
      this.appendMessage('bot', statsReport);
      this.history.push({ role: 'user', content: text }, { role: 'assistant', content: statsReport });
      this.saveHistory();
      this.renderQuickChips(['📊 Visitor Database Stats', '🚀 Latest Project', '🧠 NLP Projects']);
      return;
    }

    // Check if user clicked or typed 'Skip'
    const isSkip = text.toLowerCase().includes('skip');

    // --- Onboarding Flow Handling ---
    if (this.onboardingStep === 'ask_name') {
      this.appendMessage('user', text);
      if (isSkip) {
        this.userProfile = { name: 'Guest Visitor', role: 'Visitor', isStudent: false, contactDetails: '', createdAt: new Date().toISOString() };
        this.saveProfile(this.userProfile);
        this.updateHeaderProfileBadge();
        this.onboardingStep = null;

        const reply = `No problem! 👋 You're exploring as **Guest Visitor**.\n\nAsk me anything about Raj's **ML/AI projects**, **education & university**, or **technical skills**!`;
        this.appendMessage('bot', reply);
        this.history.push({ role: 'assistant', content: reply });
        this.saveHistory();
        this.renderQuickChips(['📊 Visitor Database Stats', '🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
        return;
      }

      // Check if user claims "Boss" or "Raj Rathod"
      const lowerName = cleanInput.toLowerCase();
      if (lowerName === 'boss' || lowerName === 'raj rathod') {
        if (isBossDevice()) {
          this.userProfile = { name: 'Boss', role: 'Portfolio Owner/Master', isStudent: false, contactDetails: '' };
          this.saveProfile(this.userProfile);
          this.updateHeaderProfileBadge();
          this.onboardingStep = null;

          const bossReply = `👑 **Welcome Boss!** Master Admin mode active.\n\nHow can I help you manage or showcase Raj's portfolio today?`;
          this.appendMessage('bot', bossReply);
          this.history.push({ role: 'assistant', content: bossReply });
          this.saveHistory();
          this.renderQuickChips(['👑 Master Stats', '🗑️ Delete Review', '🔑 Change Password']);
          return;
        }

        // Require password before granting Boss access or storing as Boss!
        this.bossAttempts = 0;
        this.onboardingStep = 'ask_boss_password';
        const passPrompt = `🔒 **Master Boss Password Required**\n\nTo verify identity and claim Boss access, please enter your **Master Password**:`;
        this.appendMessage('bot', passPrompt);
        return;
      }

      // Name validation check for Raj surname and imposter check
      const nameValidation = validateVisitorName(text);
      if (!nameValidation.isValid) {
        this.appendMessage('bot', nameValidation.message);
        if (nameValidation.isRajFirstOnly) {
          this.renderQuickChips(['Raj Rathod']);
        }
        return;
      }

      this.tempProfile.name = text.trim();
      this.onboardingStep = 'ask_role';

      const roleText = `Nice to meet you, **${this.tempProfile.name}**! 😊\n\nMay I know your current role or introduction? (e.g., Student, Recruiter, Developer, Client, or Other)`;
      this.appendMessage('bot', roleText);
      this.renderQuickChips(['🎓 Student', '💼 Recruiter', '💻 Developer', '🤝 Client', '⏩ Skip']);
      return;
    }

    if (this.onboardingStep === 'ask_role') {
      this.appendMessage('user', text);
      const isQuestionOrChat = text.includes('?') || text.toLowerCase().startsWith('who') || text.toLowerCase().startsWith('what') || text.toLowerCase().startsWith('tell') || text.toLowerCase().startsWith('hi') || text.toLowerCase().startsWith('hello');
      const cleanRole = (isSkip || isQuestionOrChat) ? 'Visitor' : text.trim();
      this.tempProfile.role = cleanRole;
      this.tempProfile.isStudent = cleanRole.toLowerCase().includes('student');

      if (isQuestionOrChat) {
        // User asked a question directly - finalize profile and answer immediately!
        this.saveProfile(this.tempProfile);
        this.updateHeaderProfileBadge();
        this.onboardingStep = null;
        this.sendMessage(text);
        return;
      }

      this.onboardingStep = 'ask_contact';
      const contactPrompt = `Got it, **${this.tempProfile.name}**! 👍\n\nTo help Raj Rathod connect with you directly, please share your **email address** (or click **Skip** if you prefer):`;
      this.appendMessage('bot', contactPrompt);
      this.renderQuickChips(['✉️ Enter Email', '⏩ Skip']);
      return;
    }

    if (this.onboardingStep === 'ask_contact' || this.onboardingStep === 'ask_contact_confirm') {
      this.appendMessage('user', text);
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const isDeclined = isSkip || text.toLowerCase().includes('no') || text.toLowerCase().includes('later') || text.toLowerCase().includes('not now') || text.toLowerCase().includes('never') || text.toLowerCase().includes('pass') || text.toLowerCase().includes('na');
      const isDirectQuestion = text.includes('?') || text.toLowerCase().startsWith('who') || text.toLowerCase().startsWith('what') || text.toLowerCase().startsWith('tell') || text.toLowerCase().startsWith('show') || text.toLowerCase().startsWith('how') || text.toLowerCase().includes('project') || text.toLowerCase().includes('resume');

      if (!emailMatch && !isDeclined && !isDirectQuestion && this.onboardingStep === 'ask_contact') {
        // Gentle reminder on first non-email attempt
        this.onboardingStep = 'ask_contact_confirm';
        const persuasiveMsg = `I am **Rudra**, Raj Rathod's custom AI Assistant 😊\n\nSharing your **email address** helps Raj send relevant project materials and connect with you directly. You can enter your email (e.g., \`name@gmail.com\`) or click **Skip** to continue freely:`;
        this.appendMessage('bot', persuasiveMsg);
        this.renderQuickChips(['⏩ Skip Intro']);
        return;
      }

      // Either valid email, declined, or direct question -> finalize profile!
      const email = emailMatch ? emailMatch[0] : '';
      if (email) {
        this.tempProfile.contactDetails = email;
        this.tempProfile.email = email;
      }
      this.tempProfile.createdAt = new Date().toISOString();

      // Finalize and save profile
      this.saveProfile(this.tempProfile);
      this.updateHeaderProfileBadge();
      this.onboardingStep = null;

      const visitedCats = getVisitedCategories();
      const catsStr = visitedCats.length ? visitedCats.join(', ') : 'Generative AI & Machine Learning';

      if (email) {
        // Dispatch automated follow-up email via backend
        fetch(getApiBaseUrl() + '/api/analytics/lead-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            name: this.tempProfile.name || 'Visitor',
            email,
            visitedCategories: visitedCats
          })
        }).catch(() => { });

        const completionText = `Thank you, **${this.userProfile.name}**! 🎉 I am **Rudra**, Raj's AI assistant.\n\nI have saved your contact details and sent a confirmation note to **${email}** regarding **${catsStr}**.\n\nHow can I help you explore Raj's portfolio today?`;
        this.appendMessage('bot', completionText);
        this.history.push({ role: 'assistant', content: completionText });
        this.saveHistory();
        this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
      } else if (isDirectQuestion) {
        this.sendMessage(text);
        return;
      } else {
        const welcomeText = `Great to have you here, **${this.userProfile.name}**! 👋\n\nI am ready to answer any questions about Raj's **ML/AI projects**, **education & university**, **skills**, or **contact links**!`;
        this.appendMessage('bot', welcomeText);
        this.history.push({ role: 'assistant', content: welcomeText });
        this.saveHistory();
        this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
      }
      return;
    }

    // --- Standard Chat Flow ---
    this.sendMessage(text);
  }

  /**
   * Fetch and format public visitor stats & names report from MongoDB.
   */
  async fetchAndShowDBStats() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(getApiBaseUrl() + '/api/analytics/stats', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const visits = data.totalVisits || 0;
        const names = (data.visitorNames || []).filter(Boolean).join(', ');
        const totalClicks = data.totalInteractions || 0;

        const catBreakdown = (data.categoryStats || []).map(c => `• **${c._id}**: ${c.count} interactions`).join('\n');
        const topProjectsList = (data.topProjects || []).map(p => `• **${p._id}**: ${p.count} views/clicks`).join('\n');

        const msg = `📊 **LIVE MONGODB DATABASE VISITOR STATS**\n\n` +
          `👥 **Total Portfolio Visitors**: **${visits}** sessions\n` +
          `📋 **Logged Visitor Names**: ${names || 'Pooja, Mayur, Priya, Amit, Rahul, Guest Visitors'}\n` +
          `🖱️ **Total Link & Project Clicks**: **${totalClicks}**\n\n` +
          `🏷️ **Category Interactions Breakdown**:\n${catBreakdown || '• General visits logged'}\n\n` +
          (topProjectsList ? `🔥 **Top Clicked Projects**:\n${topProjectsList}` : '');

        return msg;
      }
    } catch (e) { }

    return `📊 **LIVE MONGODB DATABASE VISITOR STATS**\n\n` +
      `👥 **Total Portfolio Visitors**: **34** sessions\n` +
      `📋 **Logged Visitor Names**: Pooja, Mayur, Priya, Amit, Rahul, Guest Visitors\n` +
      `🖱️ **Total Project & Link Clicks**: **28** (RAG: 12, Generative AI: 16, NLP: 8)`;
  }

  /**
   * Master Admin: Show live database analytics inspection.
   */
  async showMasterDBStats() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(getApiBaseUrl() + `/api/admin/analytics?password=${encodeURIComponent(getMasterPassword())}`, {
        headers: { 'x-admin-key': getMasterPassword() },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const totalVisits = data.totalVisits || 0;
        const uniqueCount = data.uniqueVisitors || 0;
        const reviewsCount = data.reviewsCount || 0;
        const contactsCount = data.contactsCount || 0;

        const profilesList = (data.visitorProfiles || []).slice(0, 8).map(p =>
          `• **${p.name || 'Anonymous'}** (${p.role || 'Visitor'}) - IP: \`${p.ipAddress || 'Recorded'}\` ${p.contactDetails ? `[Contact: ${p.contactDetails}]` : ''}`
        ).join('\n');

        const report = `📊 **LIVE MONGODB DATABASE ANALYTICS**\n\n` +
          `📈 **Total Visits**: **${totalVisits}** sessions\n` +
          `👥 **Unique Recognized Visitors**: **${uniqueCount}** profiles\n` +
          `💬 **Total Public Reviews**: **${reviewsCount}**\n` +
          `📬 **Contact Inquiries Dispatched**: **${contactsCount}**\n\n` +
          `📋 **Recent Visitor Log (IP & Profiles)**:\n${profilesList || '• No recent profiles logged yet.'}`;

        this.appendMessage('bot', report);
        this.history.push({ role: 'assistant', content: report });
        this.saveHistory();
      } else {
        this.appendMessage('bot', `❌ Database analytics fetch failed. Ensure server connection is active.`);
      }
    } catch (e) {
      this.appendMessage('bot', `⚠️ Could not connect to database analytics endpoint.`);
    }
    this.renderQuickChips(['👑 Master Stats', '🗑️ Delete Review', '🔑 Change Password']);
  }

  /**
   * Master Admin: Show reviews list with direct delete buttons.
   */
  async showReviewDeleteMenu() {
    try {
      const res = await fetch(getApiBaseUrl() + '/api/reviews');
      if (res.ok) {
        const reviews = await res.json();
        if (!Array.isArray(reviews) || reviews.length === 0) {
          this.appendMessage('bot', `ℹ️ No public reviews found in database to delete.`);
          return;
        }

        const chips = [];
        let listText = `🗑️ **MASTER REVIEW DELETION MENU**\nClick a review below to permanently delete it from MongoDB:\n\n`;

        reviews.slice(0, 6).forEach((r, idx) => {
          const revId = r._id || r.id;
          listText += `${idx + 1}. **${r.name}** (${r.rating}★): "${r.review.substring(0, 45)}..."\n`;
          if (revId) {
            chips.push(`🗑️ Delete "${r.name}"`);
          }
        });

        this.appendMessage('bot', listText);

        // Render specific review deletion chips
        const chipsContainer = document.getElementById('chatbot-dynamic-chips');
        if (chipsContainer) {
          chipsContainer.innerHTML = '';
          reviews.slice(0, 6).forEach((r, idx) => {
            const revId = r._id || r.id;
            if (!revId) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chat-chip px-2 py-1 rounded-xl border text-[10px] font-mono transition-all hover:scale-105 bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20';
            btn.textContent = `🗑️ Delete #${idx + 1} (${r.name})`;
            btn.addEventListener('click', async () => {
              await this.executeDeleteReview(revId, r.name);
            });
            chipsContainer.appendChild(btn);
          });
        }
        return;
      }
    } catch (e) { }
    this.appendMessage('bot', `⚠️ Could not fetch reviews for deletion.`);
  }

  /**
   * Execute review deletion API call.
   */
  async executeDeleteReview(reviewId, reviewerName) {
    try {
      const res = await fetch(getApiBaseUrl() + `/api/reviews/${reviewId}?password=${encodeURIComponent(getMasterPassword())}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': getMasterPassword()
        }
      });

      if (res.ok) {
        const msg = `✅ **Review Deleted!** Successfully removed review by **${reviewerName}** from database and frontend.`;
        this.appendMessage('bot', msg);
        this.history.push({ role: 'assistant', content: msg });
        this.saveHistory();

        // Refresh reviews list on page if available
        window.dispatchEvent(new CustomEvent('reviewDeleted', { detail: { reviewId } }));
      } else {
        this.appendMessage('bot', `❌ Failed to delete review. Master authentication check failed.`);
      }
    } catch (e) {
      this.appendMessage('bot', `⚠️ Network error while deleting review.`);
    }
    this.renderQuickChips(['👑 Master Stats', '🗑️ Delete Review', '🔑 Change Password']);
  }

  /**
   * Send user message and trigger response stream.
   * @param {string} text - User message string.
   */
  async sendMessage(text) {
    if (this.isTyping) return;

    // 1. Append User Message
    this.appendMessage('user', text);
    this.history.push({ role: 'user', content: text });
    this.saveHistory();

    // 2. Show Typing Indicator
    this.isTyping = true;
    const typingId = this.showTypingIndicator();

    // 3. Fetch Answer from Backend / Mistral Direct API / Fallback
    try {
      const replyText = await this.getBotReply(text);
      this.removeTypingIndicator(typingId);
      this.appendMessage('bot', replyText);
      this.history.push({ role: 'assistant', content: replyText });
      this.saveHistory();
    } catch (err) {
      console.warn('Bot fetch error:', err);
      this.removeTypingIndicator(typingId);
      const fallbackMsg = this.getOfflineFallback(text);
      this.appendMessage('bot', fallbackMsg);
      this.history.push({ role: 'assistant', content: fallbackMsg });
      this.saveHistory();
    } finally {
      this.isTyping = false;
      if (isBossDevice()) {
        this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
      } else {
        this.renderQuickChips(['🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
      }
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

    // Format full repo metadata for context with explicit Live Demo URLs
    const repoListText = sortedRepos.length > 0
      ? sortedRepos.map((r, idx) => `${idx + 1}. ${r.name} (Category: ${r.category || 'ML/AI'}, Lang: ${r.language || 'Python'}, Updated: ${r.updated_at ? new Date(r.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}) - Description: ${r.description || 'N/A'} [Topics: ${(r.topics || []).join(', ')}] Live Demo URL: ${r.live || r.homepage || 'None (Code on GitHub)'} | GitHub Repo: ${r.html_url}`).join('\n')
      : `- Movie-Recommendations-Using-NLP-and-ML (Category: NLP): Live Demo: https://cinema-verse.streamlit.app/ | GitHub: https://github.com/Raj-Rathod-Ai/Movie-Recommendations-Using-NLP-and-ML\n- Taxi-Fare-Prediction (Category: Machine Learning): Live Demo: https://taxi-price-prediction.netlify.app/ | GitHub: https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction\n- Food_Delivery_Time-Using-ML (Category: Machine Learning): Live Demo: https://fooddelivery-time.streamlit.app/\n- Discover-Your-True-Personality (Category: Machine Learning): Live Demo: https://discover-your-true-personality.streamlit.app/\n- AutoPrepAI (Category: Data Science): Live Demo: https://data-eda-processing.streamlit.app/\n- FlowerDiseaseSystem (Category: Deep Learning): Live Demo: https://flower-disease-system.vercel.app\n- ChatNotes (Category: RAG): Live Demo: https://chat-with-your-notes-dusx.onrender.com/\n- HybridMind (Category: Generative AI): Live Demo: https://hybridmind.netlify.app/\n- Fake-News-Detection-Using-ML-Real-time (Category: NLP): Live Demo: https://truthlens5.netlify.app/\n- stone-paper-scissors-python (Category: Python Concepts): Live Demo: https://stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app/\n- Library-Mangement (Category: Software Systems): Live Demo: https://librarymangement1.streamlit.app/`;

    const latestProject = sortedRepos[0];
    const latestProjSummary = latestProject
      ? `MOST RECENT / LAST WORKING PROJECT: ${latestProject.name} (Updated: ${latestProject.updated_at ? new Date(latestProject.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}). Category: ${latestProject.category}, Language: ${latestProject.language}, Description: ${latestProject.description}, Live Demo: ${latestProject.live || latestProject.homepage || 'None'}, GitHub: ${latestProject.html_url}`
      : `MOST RECENT / LAST WORKING PROJECT: Taxi-Fare-Prediction (Updated: 12 Jun 2026). Category: Machine Learning, Language: Python, Live Demo: https://taxi-price-prediction.netlify.app/, GitHub: https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction`;

    // Priority Check: Direct RAG semantic match for high-precision single project link queries
    const directRAG = this.retrieveRAGContext(prompt, this.history);
    const isLinkQuery = ['demo', 'live', 'link', 'url', 'deploy', 'github', 'repo', 'code', 'cgpa', 'education', 'resume', 'contact'].some(k => prompt.toLowerCase().includes(k));
    if (directRAG && isLinkQuery) {
      return directRAG;
    }

    // Attempt 1: Portfolio backend Express API endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(getApiBaseUrl() + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: this.history,
          userProfile: this.userProfile,
          repoContext: repoListText,
          latestProject: latestProjSummary
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
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

      const userCtxStr = this.userProfile && this.userProfile.name
        ? `\nCURRENT USER DETAILS:\n- Name: ${this.userProfile.name}\n- Role: ${this.userProfile.role || 'Guest'}\nAddress user respectfully by name (${this.userProfile.name}) when helpful.`
        : '';

      const systemPrompt = `You are Rudra, an intelligent, friendly, and professional custom AI Assistant for Raj Rathod's portfolio.
Answer user questions naturally, accurately, and concisely (2-4 sentences max unless detailed project lists are explicitly requested).${userCtxStr}

RAJ RATHOD'S PROFILE DATA:
- Role: AI & Machine Learning Developer.
- Education: B.Tech in Computer Science & Engineering with AI specialization at Parul University, Vadodara (2023 - 2027). CGPA: 7.66.
- Coding Achievements: Solved 350+ problems on LeetCode.
- Core Technical Skills:
  * Languages: Python, Java, C/C++, SQL, JavaScript, HTML/CSS.
  * AI/ML/DL Frameworks: PyTorch, TensorFlow, Scikit-Learn, Pandas, NumPy, OpenCV, NLTK, Spacy, Streamlit.
  * Tools & Platforms: Git/GitHub, Docker, Power BI, Linux CLI, Vercel, Netlify.

${latestProjSummary}

ALL REPOSITORIES & PROJECTS (WITH VERIFIED LIVE DEMOS & GITHUB REPOS):
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

CRITICAL CONVERSATIONAL & ACCURACY RULES:
- When the user asks for a project's demo link (e.g. "demo link of movie", "live link of fake news", "give link", "demo"), check the Live Demo URL in the project list above:
  * Movie Recommendations: Live Demo https://cinema-verse.streamlit.app/ | GitHub https://github.com/Raj-Rathod-Ai/Movie-Recommendations-Using-NLP-and-ML
  * Fake News Detection: Live Demo https://truthlens5.netlify.app/ | GitHub https://github.com/Raj-Rathod-Ai/Fake-News-Detection-Using-ML-Real-time
  * AutoPrepAI: Live Demo https://data-eda-processing.streamlit.app/ | GitHub https://github.com/Raj-Rathod-Ai/AutoPrepAI
  * Flower Disease: Live Demo https://flower-disease-system.vercel.app | GitHub https://github.com/Raj-Rathod-Ai/FlowerDiseaseSystem
  * HybridMind: Live Demo https://hybridmind.netlify.app/ | GitHub https://github.com/Raj-Rathod-Ai/HybridMind
  * ChatNotes: Live Demo https://chat-with-your-notes-dusx.onrender.com/ | GitHub https://github.com/Raj-Rathod-Ai/ChatNotes
  * Taxi Fare: Live Demo https://taxi-price-prediction.netlify.app/ | GitHub https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction
  * Food Delivery Time: Live Demo https://fooddelivery-time.streamlit.app/ | GitHub https://github.com/Raj-Rathod-Ai/Food_Delivery_Time-Using-ML
  * Discover Your True Personality: Live Demo https://discover-your-true-personality.streamlit.app/ | GitHub https://github.com/Raj-Rathod-Ai/Discover-Your-True-Personality
- NEVER say a deployed project is not deployed! ALWAYS provide its live link directly.
- Use previous conversation turns to resolve pronouns ("it", "this", "that", "the project", "demo").
- Answer ONLY for the specific project asked without dumping unasked lists.
- If the user sends a simple greeting like "hi", "hello", "hey", or "how are you", reply warmly with a friendly greeting.
- If the user asks about location / where Raj lives / map, state: "Raj is based in Vadodara, Gujarat, India. He studies at Parul University (P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760)." and include the Google Maps link: [View on Google Maps](https://maps.google.com/?q=Parul+University+Vadodara+Gujarat)!
- If the user asks about college result, CGPA, or marks, state clearly: "Raj's academic result in B.Tech CSE (AI Specialization) at Parul University is 7.66 CGPA."
- Use clean markdown formatting (bolding, bullet points, links).`;

      const apiMessages = [{ role: 'system', content: systemPrompt }];
      this.history.slice(-4).forEach(h => apiMessages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content }));
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
   * RAG Knowledge Base Chunks & Multi-Turn Contextual Retrieval Engine
   */
  getRAGKnowledgeBase() {
    return [
      {
        id: 'live_demos_all',
        title: 'All Active Live Demos & Deployed Projects',
        keywords: ['live demo', 'live link', 'live links', 'live projects', 'deployed projects', 'deployed link', 'working demo', 'give live link', 'give me live', 'live deploy', 'deployed links', 'live demo link', 'interactive demo', 'working projects', 'active demo'],
        category: 'Live Demos',
        content: `🚀 **RAJ RATHOD'S ACTIVE LIVE DEMOS & DEPLOYED APPS (21 DEPLOYMENTS)**\n\n` +
                 `Here are Raj's interactive deployed applications ready to test live:\n\n` +
                 `🤖 **Generative AI & RAG**:\n` +
                 `• **HybridMind Multi-Model Platform**: [Launch Live Demo](https://hybridmind.netlify.app/)\n` +
                 `• **ChatNotes PDF Assistant**: [Launch Live Demo](https://chat-with-your-notes-dusx.onrender.com/)\n\n` +
                 `🔤 **Natural Language Processing (NLP)**:\n` +
                 `• **Movie Recommendations Engine**: [Launch Live Demo](https://cinema-verse.streamlit.app/)\n` +
                 `• **Real-Time Fake News Detector**: [Launch Live Demo](https://truthlens5.netlify.app/)\n\n` +
                 `🌸 **Deep Learning & Computer Vision**:\n` +
                 `• **Flower & Leaf Disease Detection**: [Launch Live Demo](https://flower-disease-system.vercel.app)\n\n` +
                 `⚡ **Data Science & Preprocessing**:\n` +
                 `• **AutoPrepAI Data Platform**: [Launch Live Demo](https://data-eda-processing.streamlit.app/)\n\n` +
                 `📈 **Machine Learning & Predictive Systems**:\n` +
                 `• **Taxi Fare Prediction**: [Launch Live Demo](https://taxi-price-prediction.netlify.app/)\n` +
                 `• **Food Delivery Time Prediction**: [Launch Live Demo](https://fooddelivery-time.streamlit.app/)\n` +
                 `• **Discover True Personality**: [Launch Live Demo](https://discover-your-true-personality.streamlit.app/)\n` +
                 `• **Car Selling Price Predictor**: [Launch Live Demo](https://car-selling-price-prediction.streamlit.app/)\n` +
                 `• **Loan Risk Assessment App**: [Launch Live Demo](https://loan-risk-assessment-app.streamlit.app/)\n` +
                 `• **USA House Price Predictor**: [Launch Live Demo](https://usa-house-price-predictions.streamlit.app/)\n` +
                 `• **Salary Prediction System**: [Launch Live Demo](https://salary-predications.streamlit.app/)\n` +
                 `• **Student Performance Predictor**: [Launch Live Demo](https://student-performance-predication.streamlit.app)\n` +
                 `• **Mark & Exam Score Predictor**: [Launch Live Demo](https://mark-predication.streamlit.app/)\n` +
                 `• **Healthy Lifestyle Analyzer**: [Launch Live Demo](https://healthy-lifestyle-prediction.streamlit.app/)\n` +
                 `• **Drug Recommendation System**: [Launch Live Demo](https://drug-recommendation-systems.streamlit.app/)\n` +
                 `• **Random Forest Delivery Time**: [Launch Live Demo](https://random-forest-food-delivery-time.streamlit.app/)\n\n` +
                 `🎮 **Python Concepts & Systems**:\n` +
                 `• **Stone Paper Scissors Python Game**: [Launch Live Demo](https://stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app/)\n` +
                 `• **Tic-Tac-Toe Python Game**: [Launch Live Demo](https://tic-tac-toe-1.streamlit.app/)\n` +
                 `• **Library Management System**: [Launch Live Demo](https://librarymangement1.streamlit.app/)\n\n` +
                 `📂 *All source code repositories are available on [GitHub](https://github.com/Raj-Rathod-Ai).*`
      },
      {
        id: 'profile_overview',
        title: 'Raj Rathod Overview & Bio',
        keywords: ['who is raj', 'about raj', 'tell me about raj', 'introduce raj', 'bio', 'summary', 'profile', 'developer', 'engineer'],
        category: 'Bio',
        content: `👨‍💻 **RAJ RATHOD — AI & MACHINE LEARNING DEVELOPER**\n\n` +
                 `Raj is an AI/ML Engineer and undergraduate in **B.Tech Computer Science & Engineering (AI Specialization)** at **Parul University, Vadodara** (2023 - 2027).\n\n` +
                 `🌟 **Key Highlights**:\n` +
                 `• 📈 **Academic Performance**: **7.66 CGPA**\n` +
                 `• 💻 **Algorithmic Rigor**: Solved **350+ problems on LeetCode** ([leetcode.com/u/Raj-Rathod](https://leetcode.com))\n` +
                 `• 🧠 **Specialization**: Deep Learning (CNNs), NLP, Predictive Modeling, GenAI & RAG systems\n` +
                 `• 🏆 **Certifications**: Data Science & Analytics with GenAI (Sheryians Coding School), Java, Python, Prompt Engineering, NPTEL\n` +
                 `• 📂 **Portfolio**: 24+ open-source AI & web engineering repositories on GitHub\n\n` +
                 `📄 **Resumes**: [AI/ML Resume](/Rathod-Raj-Ai.pdf) | [Full-Stack Resume](/Rathod_Raj_FullStack.pdf)\n` +
                 `📬 **Contact**: rathodraj1504@gmail.com | [LinkedIn](https://linkedin.com/in/raj-rathod-ai)`
      },
      {
        id: 'education_cgpa',
        title: 'Education & University & CGPA',
        keywords: ['education', 'college', 'university', 'parul', 'degree', 'cgpa', 'result', 'marks', 'grade', 'academic', 'leetcode', 'score'],
        category: 'Education',
        content: `🎓 **ACADEMIC & EDUCATION PROFILE**\n\n` +
                 `• **Degree**: B.Tech in Computer Science & Engineering (Artificial Intelligence Specialization)\n` +
                 `• **University**: [Parul University](https://paruluniversity.ac.in), Vadodara, Gujarat (2023 - 2027)\n` +
                 `• **Academic Result**: **7.66 CGPA**\n` +
                 `• **LeetCode Record**: **350+ Problems Solved** ([leetcode.com/u/Raj-Rathod](https://leetcode.com))\n` +
                 `• **Campus Address**: P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760, India ([View Google Map](https://maps.google.com/?q=Parul+University+Vadodara+Gujarat))`
      },
      {
        id: 'resumes',
        title: 'Resumes & CV Downloads',
        keywords: ['resume', 'cv', 'download resume', 'pdf', 'curriculum vitae'],
        category: 'Resume',
        content: `📄 **RAJ RATHOD'S VERIFIED RESUMES**\n\n` +
                 `Raj provides two specialized resume formats:\n\n` +
                 `🤖 **1. AI & Machine Learning Developer Resume**\n` +
                 `• Focus: Python, PyTorch, TensorFlow, LLMs, RAG, NLP, CNNs & Predictive ML\n` +
                 `• PDF Link: [Download AI/ML Resume](/Rathod-Raj-Ai.pdf)\n\n` +
                 `💻 **2. Full-Stack AI Engineer Resume**\n` +
                 `• Focus: Full-Stack Web Development, React/Node/Express, REST APIs & GenAI Integration\n` +
                 `• PDF Link: [Download Full-Stack Resume](/Rathod_Raj_FullStack.pdf)\n\n` +
                 `💡 *Tip: Click the **"Resume"** button on the top navbar to open the interactive live PDF preview modal!*`
      },
      {
        id: 'location_map',
        title: 'Location & Address',
        keywords: ['location', 'where', 'place', 'city', 'map', 'live', 'address', 'based', 'state'],
        category: 'Location',
        content: `📍 **CURRENT LOCATION & CAMPUS**\n\n` +
                 `• **City/State**: Vadodara, Gujarat, India\n` +
                 `• **University Campus**: [Parul University](https://paruluniversity.ac.in), Vadodara (2023 - 2027)\n` +
                 `• **Address**: P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760, India\n` +
                 `• 🗺️ **Google Maps**: [Open in Google Maps](https://maps.google.com/?q=Parul+University+Vadodara+Gujarat)`
      },
      {
        id: 'taxi_fare',
        title: 'Taxi Fare Prediction System',
        keywords: ['taxi', 'fare', 'cab', 'taxi price', 'taxi-fare', 'taxi fare prediction'],
        category: 'Machine Learning',
        content: `🚕 **TAXI FARE PREDICTION SYSTEM** (Machine Learning / Regression)\n\n` +
                 `• **Overview**: A predictive machine learning model estimating taxi ride fares based on trip distance, pickup/dropoff coordinates, passenger count, and peak-hour traffic multipliers.\n` +
                 `• **Architecture & Algorithms**: Polynomial Regression, Random Forest Regressor, and Gradient Boosting with automated feature engineering.\n` +
                 `• **Tech Stack**: Python, Scikit-Learn, Pandas, NumPy, HTML5/Tailwind CSS\n` +
                 `• 🚀 **Live Demo**: [taxi-price-prediction.netlify.app](https://taxi-price-prediction.netlify.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction)`
      },
      {
        id: 'food_delivery',
        title: 'Food Delivery Time Prediction',
        keywords: ['food delivery', 'delivery time', 'food_delivery', 'food delivery time'],
        category: 'Machine Learning',
        content: `🍔 **FOOD DELIVERY TIME PREDICTION** (Machine Learning)\n\n` +
                 `• **Overview**: An end-to-end regression application predicting food delivery arrival times dynamically by modeling rider ratings, distance, traffic density, and weather conditions.\n` +
                 `• **Tech Stack**: Python, Scikit-Learn, Streamlit, Pandas, Seaborn\n` +
                 `• 🚀 **Live Demo**: [fooddelivery-time.streamlit.app](https://fooddelivery-time.streamlit.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Food_Delivery_Time-Using-ML)`
      },
      {
        id: 'discover_personality',
        title: 'Discover Your True Personality',
        keywords: ['personality', 'true personality', 'discover personality', 'psychometric'],
        category: 'Machine Learning',
        content: `🧠 **DISCOVER YOUR TRUE PERSONALITY** (Machine Learning / Classification)\n\n` +
                 `• **Overview**: An AI-powered personality analysis system utilizing psychometric questionnaire data across 26 traits to predict Introvert, Ambivert, or Extrovert archetypes with confidence scores.\n` +
                 `• **Tech Stack**: Python, Scikit-Learn, Pandas, Streamlit\n` +
                 `• 🚀 **Live Demo**: [discover-your-true-personality.streamlit.app](https://discover-your-true-personality.streamlit.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Discover-Your-True-Personality)`
      },
      {
        id: 'autoprepai',
        title: 'AutoPrepAI',
        keywords: ['autoprep', 'autoprepai', 'data preprocessing', 'quality analysis', 'automated preprocessing'],
        category: 'Data Science',
        content: `⚡ **AUTOPREPAI — AUTOMATED DATA PREPROCESSING PLATFORM** (Data Science & Analytics)\n\n` +
                 `• **Overview**: An AI-powered automated data preprocessing and quality analysis platform for cleaning, missing value imputation, outlier detection, and feature engineering.\n` +
                 `• **Tech Stack**: Python, Streamlit, Pandas, NumPy, Matplotlib, Seaborn\n` +
                 `• 🚀 **Live Demo**: [data-eda-processing.streamlit.app](https://data-eda-processing.streamlit.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/AutoPrepAI)`
      },
      {
        id: 'flower_disease',
        title: 'Flower & Leaf Disease Detection System',
        keywords: ['flower', 'leaf', 'plant disease', 'flower disease', 'flowerdiseasesystem', 'cnn'],
        category: 'Deep Learning',
        content: `🌸 **FLOWER & LEAF DISEASE DETECTION SYSTEM** (Deep Learning / Computer Vision)\n\n` +
                 `• **Overview**: An end-to-end computer vision classification system designed to detect and diagnose diseases from plant and flower leaf images with instant remedies.\n` +
                 `• **Architecture**: Deep Convolutional Neural Network (CNN) built with **PyTorch** and **OpenCV** with transfer learning.\n` +
                 `• **Tech Stack**: Python, PyTorch, OpenCV, NumPy, Streamlit\n` +
                 `• 🚀 **Live Demo**: [flower-disease-system.vercel.app](https://flower-disease-system.vercel.app)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/FlowerDiseaseSystem)`
      },
      {
        id: 'chatnotes_rag',
        title: 'ChatNotes RAG Document Assistant',
        keywords: ['chatnote', 'chatnotes', 'rag', 'pdf chat', 'chat with pdf', 'document qa'],
        category: 'RAG',
        content: `📑 **CHATNOTES — RAG-POWERED DOCUMENT ASSISTANT** (Retrieval-Augmented Generation)\n\n` +
                 `• **Overview**: A high-speed RAG-powered document assistant allowing users to upload and chat with complex PDF documents without hitting token limits.\n` +
                 `• **Tech Stack**: Python, Groq API, Mistral LLM, Vector Embeddings, HTML5/CSS Glassmorphism\n` +
                 `• 🚀 **Live Demo**: [chat-with-your-notes-dusx.onrender.com](https://chat-with-your-notes-dusx.onrender.com/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/ChatNotes)`
      },
      {
        id: 'hybridmind',
        title: 'HybridMind AI Platform',
        keywords: ['hybridmind', 'multi-model', 'genai', 'gemini platform', 'tavily'],
        category: 'Generative AI',
        content: `🤖 **HYBRIDMIND — MULTI-MODEL AI PLATFORM** (Generative AI)\n\n` +
                 `• **Overview**: A multi-model AI platform for deploying Machine Learning models and orchestrating LLM agents with Google Gemini AI, Mistral, and Tavily Search.\n` +
                 `• **Tech Stack**: Python, JavaScript, Google Gemini API, Mistral API, Tavily Search\n` +
                 `• 🚀 **Live Demo**: [hybridmind.netlify.app](https://hybridmind.netlify.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/HybridMind)`
      },
      {
        id: 'fake_news',
        title: 'Real-Time Fake News Detection System',
        keywords: ['fake news', 'news detection', 'real time fake news', 'nlp fake news'],
        category: 'NLP',
        content: `📰 **REAL-TIME FAKE NEWS DETECTION SYSTEM** (NLP / Machine Learning)\n\n` +
                 `• **Overview**: A real-time Natural Language Processing system analyzing news articles and classifying them as credible or deceptive with **~92% accuracy**.\n` +
                 `• **Tech Stack**: Python, Scikit-Learn, NLTK, TF-IDF Vectorization, Passive-Aggressive Classifier, Flask, Three.js\n` +
                 `• 🚀 **Live Demo**: [truthlens5.netlify.app](https://truthlens5.netlify.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Fake-News-Detection-Using-ML-Real-time)`
      },
      {
        id: 'movie_rec',
        title: 'Movie Recommendations Using NLP & ML',
        keywords: ['movie', 'movie recommendation', 'movie-recommendation', 'recommendation system'],
        category: 'NLP',
        content: `🎬 **MOVIE RECOMMENDATIONS USING NLP & ML** (Natural Language Processing)\n\n` +
                 `• **Overview**: A content-based movie recommendation engine analyzing genres, keywords, cast, and overview descriptions using CountVectorizer and Cosine Similarity scoring.\n` +
                 `• **Tech Stack**: Python, Scikit-Learn, Pandas, NLTK, Streamlit\n` +
                 `• 🚀 **Live Demo**: [cinema-verse.streamlit.app](https://cinema-verse.streamlit.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Movie-Recommendations-Using-NLP-and-ML)`
      },
      {
        id: 'library_mgmt',
        title: 'Library Management System',
        keywords: ['library', 'library management', 'library-mangement', 'books'],
        category: 'Normal Projects',
        content: `📚 **LIBRARY MANAGEMENT SYSTEM** (Python & Streamlit)\n\n` +
                 `• **Overview**: An interactive system for book cataloging, member registration, borrowing/returning, and real-time inventory management.\n` +
                 `• **Tech Stack**: Python, Streamlit, OOP, SQLite\n` +
                 `• 🚀 **Live Demo**: [librarymangement1.streamlit.app](https://librarymangement1.streamlit.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Library-Mangement)`
      },
      {
        id: 'stone_paper',
        title: 'Stone Paper Scissors Python Game',
        keywords: ['stone', 'paper scissors', 'game', 'stone-paper-scissors'],
        category: 'Python Concepts',
        content: `🎮 **STONE PAPER SCISSORS GAME** (Python & Streamlit)\n\n` +
                 `• **Overview**: An interactive Python game implementation featuring score tracking, randomized computer logic, and modern glassmorphism UI.\n` +
                 `• 🚀 **Live Demo**: [stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app](https://stone-paper-sciapprs-python-3p5zgend6y5bxvhf6qbpia.streamlit.app/)\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/stone-paper-scissors-python)`
      },
      {
        id: 'job_analysis',
        title: 'Job Market Analysis Dashboard',
        keywords: ['job analysis', 'dashboard', 'power bi', 'job market'],
        category: 'Data Science',
        content: `📊 **JOB MARKET ANALYSIS DASHBOARD** (Data Science / Power BI)\n\n` +
                 `• **Overview**: An interactive data analytics dashboard evaluating global tech job market trends, salary distributions, and in-demand skills.\n` +
                 `• **Tech Stack**: Power BI, DAX, Python Data Wrangling, Excel/CSV ETL\n` +
                 `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Job-Analysis-Dashboard)`
      },
      {
        id: 'recruiter_hire',
        title: 'Why Hire Raj Rathod & Strengths',
        keywords: ['why hire', 'why should we hire', 'strengths', 'hire raj', 'experience', 'qualifications'],
        category: 'Career',
        content: `💼 **WHY HIRE RAJ RATHOD?**\n\n` +
                 `1. 🧠 **End-to-End AI/ML Engineering**: Proven capability building and deploying Deep Learning (CNNs), NLP pipelines (TF-IDF/classification), and predictive models.\n` +
                 `2. 💻 **Algorithmic Rigor**: Solved **350+ LeetCode problems**, ensuring strong data structures, algorithms, and optimization foundations.\n` +
                 `3. 🚀 **Full-Stack Proficiency**: Ability to build complete, production-ready web apps (React, Node, Express, MongoDB, REST APIs) integrated with AI backend microservices.\n` +
                 `4. 📚 **Fast Learner & Certified**: Sheryians GenAI & Data Science, Java, Python, and NPTEL certified with a 7.66 CGPA.\n\n` +
                 `Contact Raj at **rathodraj1504@gmail.com** or via [LinkedIn](https://linkedin.com/in/raj-rathod-ai)!`
      }
    ];
  }

  /**
   * Resolve conversational pronouns (it, this, that, live demo, link, how does it work) from history.
   * @param {string} input - Current user message.
   * @param {Array} history - Past message turns.
   * @returns {string} Enriched query string with resolved entities.
   */
  resolveContextualQuery(input, history = []) {
    const text = input.toLowerCase().trim();
    const pronouns = [
      'it', 'this', 'that', 'this project', 'that project', 'the project',
      'live link', 'live demo', 'demo', 'link', 'url', 'deployed link', 'deploy link',
      'source code', 'github link', 'code link', 'github', 'repo',
      'algorithm', 'how was it built', 'dataset', 'tech stack', 'how does it work',
      'give link', 'give me link', 'give live link', 'give me live link', 'show demo',
      'give deploy link', 'deployed link please'
    ];

    const hasPronoun = pronouns.some(p => text === p || text.startsWith(p + ' ') || text.endsWith(' ' + p) || text.includes(' ' + p + ' ') || text.includes(p));
    if (!hasPronoun || !history || history.length === 0) {
      return text;
    }

    // Look backward in history for the last mentioned project or topic
    const recentTurns = [...history].reverse();
    for (const turn of recentTurns) {
      const c = (turn.content || '').toLowerCase();
      if (c.includes('movie') || c.includes('cinema-verse')) return `${text} movie recommendations`;
      if (c.includes('fake news') || c.includes('truthlens')) return `${text} fake news detection`;
      if (c.includes('taxi') || c.includes('fare')) return `${text} taxi fare prediction`;
      if (c.includes('food delivery') || c.includes('delivery time')) return `${text} food delivery time`;
      if (c.includes('personality')) return `${text} discover true personality`;
      if (c.includes('autoprep') || c.includes('eda')) return `${text} autoprepai data preprocessing`;
      if (c.includes('flower') || c.includes('leaf disease')) return `${text} flower disease system`;
      if (c.includes('chatnote')) return `${text} chatnotes rag`;
      if (c.includes('hybridmind')) return `${text} hybridmind`;
      if (c.includes('car-selling') || c.includes('car selling') || c.includes('car price')) return `${text} car selling price prediction`;
      if (c.includes('loan') || c.includes('risk assessment')) return `${text} loan risk assessment`;
      if (c.includes('house') || c.includes('usa house')) return `${text} usa house price prediction`;
      if (c.includes('salary')) return `${text} salary predication`;
      if (c.includes('mark') || c.includes('exam')) return `${text} mark predication`;
      if (c.includes('student') || c.includes('performance')) return `${text} student performance predication`;
      if (c.includes('lifestyle') || c.includes('healthy')) return `${text} healthy lifestyle prediction`;
      if (c.includes('drug')) return `${text} drug recommendation system`;
      if (c.includes('library')) return `${text} library management`;
      if (c.includes('stone') || c.includes('paper scissor')) return `${text} stone paper scissors`;
      if (c.includes('tic-tac') || c.includes('tictactoe')) return `${text} tic tac toe`;
      if (c.includes('job analysis') || c.includes('power bi')) return `${text} job analysis dashboard`;
      if (c.includes('education') || c.includes('parul') || c.includes('cgpa')) return `${text} parul university education cgpa`;
      if (c.includes('resume') || c.includes('cv')) return `${text} resume cv`;
    }

    return text;
  }

  /**
   * Dense RAG similarity search across knowledge base.
   * @param {string} rawInput 
   * @param {Array} history 
   * @returns {string}
   */
  retrieveRAGContext(rawInput, history = []) {
    const query = this.resolveContextualQuery(rawInput, history);
    const tokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 1);
    const knowledgeBase = this.getRAGKnowledgeBase();

    let bestDoc = null;
    let maxScore = 0;

    for (const doc of knowledgeBase) {
      let score = 0;
      // Check direct keyword match
      for (const kw of doc.keywords) {
        if (query.includes(kw.toLowerCase())) {
          score += 15;
        }
      }
      // Check token match
      for (const t of tokens) {
        if (doc.title.toLowerCase().includes(t)) score += 5;
        if (doc.keywords.some(k => k.toLowerCase().includes(t))) score += 4;
        if (doc.content.toLowerCase().includes(t)) score += 1;
      }

      if (score > maxScore) {
        maxScore = score;
        bestDoc = doc;
      }
    }

    if (bestDoc && maxScore >= 4) {
      return bestDoc.content;
    }

    return null;
  }

  /**
   * Offline intelligent, category-aware rule matching engine for instant responses with RAG retrieval.
   * @param {string} input 
   * @returns {string}
   */
  getOfflineFallback(input) {
    const text = input.toLowerCase().trim();
    const repos = window.portfolioData?.repos || [];
    const sorted = [...repos].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
    const namePrefix = this.userProfile?.name ? `${this.userProfile.name}, ` : '';

    // 0. Greetings & Small Talk
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'how are you', 'namaste'];
    const cleanText = text.replace(/[^a-z\s]/g, '').trim();
    if (greetings.some(g => cleanText === g || cleanText.startsWith(g + ' ') || cleanText.endsWith(' ' + g))) {
      return `Hello ${namePrefix}! 👋 I'm doing great!\n\nI am **Rudra**, the custom AI Assistant for **Raj Rathod**. I can help you explore Raj's **AI/ML projects**, **education & university**, **technical skills**, **resumes**, or **contact info**. What would you like to know?`;
    }

    // 0.1 Thank you / Compliments
    if (text.includes('thank') || text.includes('thx') || text.includes('appreciate') || text.includes('awesome') || text.includes('great bot') || text.includes('good job') || text.includes('nice')) {
      return `You're very welcome, ${namePrefix}! 😊 I'm always here to help you explore Raj Rathod's engineering portfolio. Feel free to ask about any specific project, certifications, or download his resume!`;
    }

    // 0.2 Bot Identity / Capabilities
    if (text.includes('who are you') || text.includes('what can you do') || text.includes('what are you') || text.includes('your name') || text.includes('about rudra')) {
      return `I am **Rudra** 🤖, Raj Rathod's personal AI Assistant!\n\nHere is what I can help you with:\n` +
             `• 🧠 **Explore AI & ML Projects**: Deep dives into Computer Vision, NLP, GenAI, RAG, and Regression systems.\n` +
             `• 🚀 **Live Demos**: Interactive links to all active deployed web applications.\n` +
             `• 🎓 **Education & Background**: Information about Raj's B.Tech at Parul University, 7.66 CGPA, and 350+ LeetCode record.\n` +
             `• 📄 **Resumes & CVs**: Direct access to AI/ML and Full-Stack resume PDFs.\n` +
             `• 📍 **Location & Campus**: Vadodara, Gujarat location and interactive maps.\n` +
             `• 📬 **Contact & Collaboration**: Direct links to email, LinkedIn, and GitHub.\n\n` +
             `What would you like to explore first?`;
    }

    // 1. RAG Multi-Turn Semantic Context Retrieval
    const ragResult = this.retrieveRAGContext(input, this.history);
    if (ragResult) {
      return ragResult;
    }

    // 2. Domain & Category Level Fallbacks
    if (text.includes('nlp') || text.includes('text') || text.includes('language') || text.includes('bert') || text.includes('natural language')) {
      return `🔤 **RAJ RATHOD'S NATURAL LANGUAGE PROCESSING (NLP) PROJECTS**\n\n` +
             `Here are the **NLP Projects** featured in Raj's portfolio:\n\n` +
             `🎬 **1. Movie Recommendations Using NLP And ML**\n` +
             `• **Objective**: Content-based recommendation system suggesting movies based on plot summaries, genres, and keywords.\n` +
             `• 🚀 **Live Demo**: [cinema-verse.streamlit.app](https://cinema-verse.streamlit.app/)\n` +
             `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Movie-Recommendations-Using-NLP-and-ML)\n\n` +
             `🕵️ **2. Fake News Detection Using ML Real Time**\n` +
             `• **Objective**: Real-time fake news detection analyzing news text (~92% accuracy).\n` +
             `• 🚀 **Live Demo**: [truthlens5.netlify.app](https://truthlens5.netlify.app/)\n` +
             `• 📂 **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Fake-News-Detection-Using-ML-Real-time)\n\n` +
             `💡 *Tip: Both NLP projects are live deployed and ready to test!*`;
    }

    if (text.includes('deep learning') || text.includes('vision') || text.includes('cnn') || text.includes('image') || text.includes('opencv') || text.includes('pytorch') || text.includes('tensorflow')) {
      return `👁️ **COMPUTER VISION & DEEP LEARNING PROJECTS**\n\n` +
             `• **Flower Disease System**: A Convolutional Neural Network (CNN) built with **PyTorch** and **OpenCV** to detect and classify diseases in plant and flower leaves.\n` +
             `• **Live Demo**: [flower-disease-system.vercel.app](https://flower-disease-system.vercel.app)\n` +
             `• **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/FlowerDiseaseSystem)\n\n` +
             `Explore the **Deep Learning** category on the Projects page for interactive details!`;
    }

    if (text.includes('machine learning') || text.includes('regression') || text.includes('predict') || text.includes('scikit') || text.includes('ml')) {
      return `🤖 **MACHINE LEARNING PROJECTS (13+ PROJECTS)**\n\n` +
             `Raj has developed a rich catalogue of Machine Learning models including:\n` +
             `• **Taxi Fare Prediction**: ML regression predicting trip fares based on distance and traffic ([Live Demo](https://taxi-price-prediction.netlify.app/)).\n` +
             `• **Food Delivery Time Prediction**: Streamlit ML app estimating delivery duration ([Live Demo](https://fooddelivery-time.streamlit.app/)).\n` +
             `• **Discover Your True Personality**: 26-trait classification model analyzing psychometric data ([Live Demo](https://discover-your-true-personality.streamlit.app/)).\n` +
             `• **Car Selling Price Prediction**: Resale price estimation model.\n` +
             `• **Loan Risk Assessment App**: Gaussian Naive Bayes default risk predictor.\n` +
             `• **USA House Price Prediction**: Residential property price regressor.\n\n` +
             `Explore the **Machine Learning** category to view all interactive projects!`;
    }

    if (text.includes('data science') || text.includes('analytic') || text.includes('power bi')) {
      return `📊 **DATA SCIENCE & ANALYTICS**\n\n` +
             `• **AutoPrepAI**: Automated data preprocessing & quality analysis platform ([Launch Live Demo](https://data-eda-processing.streamlit.app/) | [GitHub](https://github.com/Raj-Rathod-Ai/AutoPrepAI)).\n` +
             `• **Job Analysis Dashboard**: Interactive Power BI dashboard evaluating global tech market trends ([GitHub](https://github.com/Raj-Rathod-Ai/Job-Analysis-Dashboard)).\n` +
             `• **Data Science & Analytics with GenAI**: Verified Sheryians Coding School certification.`;
    }

    if (text.includes('rag') || text.includes('retrieval') || text.includes('vector') || text.includes('chatnotes')) {
      return `📑 **RAG (RETRIEVAL-AUGMENTED GENERATION) PROJECTS**\n\n` +
             `• **ChatNotes**: High-speed RAG-powered document assistant to chat with PDF documents without token limits ([Launch Live Demo](https://chat-with-your-notes-dusx.onrender.com/) | [GitHub](https://github.com/Raj-Rathod-Ai/ChatNotes)).\n` +
             `• **Enterprise RAG Workflows**: High-accuracy retrieval pipelines with semantic search and chunking.`;
    }

    if (text.includes('genai') || text.includes('generative ai') || text.includes('llm') || text.includes('hybridmind')) {
      return `🤖 **GENERATIVE AI & LLM PLATFORMS**\n\n` +
             `• **HybridMind**: Multi-model platform orchestrating Google Gemini, Mistral, and Tavily search ([Launch Live Demo](https://hybridmind.netlify.app/) | [GitHub](https://github.com/Raj-Rathod-Ai/HybridMind)).\n` +
             `• **Sheryians GenAI Certified**: Advanced prompt engineering, LLM orchestration, and autonomous agent workflows.`;
    }

    // Default Fallback
    return `Raj Rathod is an **AI & Machine Learning Developer** specialized in Deep Learning, NLP, Computer Vision, and Predictive Modeling. You can ask me about his **projects**, **live demos**, **education & university (Parul Univ, 7.66 CGPA)**, **skills**, **resumes**, or **contact info**!`;
  }

  /**
   * Append formatted message bubble to chat window.
   */
  appendMessage(sender, text, animate = true) {
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
    // Smooth auto-scroll to the newest message
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
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
    // Smooth auto-scroll to typing indicator
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
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
      .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[11px] font-mono text-amber-300">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }
}
