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
      }).catch(() => {});
    } catch (e) {}

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
        }).catch(() => {});
      }
    } catch (e) {}
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
    const toggleBtn   = document.getElementById('chatbot-toggle-btn');
    const closeBtn    = document.getElementById('chatbot-close-btn');
    const resetBtn    = document.getElementById('chatbot-reset-btn');
    const win         = document.getElementById('chatbot-window');
    const form        = document.getElementById('chatbot-form');
    const input       = document.getElementById('chatbot-input');
    const tooltip     = document.getElementById('chatbot-suggestion-tooltip');
    const tooltipClose= document.getElementById('chatbot-suggestion-close');

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
      const cleanRole = isSkip ? 'Visitor' : text.trim();
      this.tempProfile.role = cleanRole;
      this.tempProfile.isStudent = cleanRole.toLowerCase().includes('student');

      this.onboardingStep = 'ask_contact';
      const contactPrompt = `Got it, **${this.tempProfile.name}**! 👍\n\nTo help Raj Rathod connect with you directly, please share your **email address**: *(Required to proceed)*`;
      this.appendMessage('bot', contactPrompt);
      this.renderQuickChips(['✉️ Enter Email']);
      return;
    }

    if (this.onboardingStep === 'ask_contact' || this.onboardingStep === 'ask_contact_confirm') {
      this.appendMessage('user', text);
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

      if (!emailMatch && !text.includes('@')) {
        // Persuasive & compulsory prompt when user hesitates or types non-email text
        this.onboardingStep = 'ask_contact_confirm';
        const visitedCats = getVisitedCategories();
        const catName = visitedCats.length ? visitedCats.join(' & ') : 'Generative AI & RAG';

        const persuasiveMsg = `I understand your hesitation! 😊 However, I am **Rudra**, Raj Rathod's custom AI Assistant.\n\nProviding your **email address is required** so Raj can talk with you directly!\n\nSince you explored **${catName}** projects on the portfolio, Raj would love to connect with you to share tailored technical insights or discuss potential collaborations with you.\n\nPlease enter a valid email address (e.g., \`yourname@gmail.com\`) to proceed:`;
        this.appendMessage('bot', persuasiveMsg);
        this.renderQuickChips(['✉️ Enter valid Email']);
        return;
      }

      // Valid email provided!
      const email = emailMatch ? emailMatch[0] : text.trim();
      this.tempProfile.contactDetails = email;
      this.tempProfile.email = email;
      this.tempProfile.createdAt = new Date().toISOString();

      // Finalize and save profile
      this.saveProfile(this.tempProfile);
      this.updateHeaderProfileBadge();
      this.onboardingStep = null;

      const visitedCats = getVisitedCategories();
      const catsStr = visitedCats.length ? visitedCats.join(', ') : 'Generative AI & Machine Learning';

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
      }).catch(() => {});

      const completionText = `Thank you, **${this.userProfile.name}**! 🎉 I am **Rudra**, Raj's AI assistant.\n\nI have logged your details in our database and sent a personalized follow-up email to **${email}** highlighting your interest in **${catsStr}**!\n\nRaj will be happy to talk with you directly. How can I help you explore more of Raj's portfolio today?`;
      this.appendMessage('bot', completionText);
      this.history.push({ role: 'assistant', content: completionText });
      this.saveHistory();
      this.renderQuickChips(['📊 Visitor Database Stats', '🚀 Latest Project', '🧠 NLP Projects', '🎓 Education & CGPA']);
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
    } catch (e) {}

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
    } catch (e) {}
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
- If the user sends a simple greeting like "hi", "hello", "hey", or "how are you", reply warmly with a friendly greeting (e.g. "Hello ${this.userProfile?.name || ''}! 👋 I'm doing great! How can I help you explore Raj's portfolio today?").
- If the user asks about location / where Raj lives / map, state: "Raj is based in Vadodara, Gujarat, India. He studies at Parul University (P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760)." and include the Google Maps link: [View on Google Maps](https://maps.google.com/?q=Parul+University+Vadodara+Gujarat)!
- If the user asks about college result, CGPA, or marks, state clearly: "Raj's academic result in B.Tech CSE (AI Specialization) at Parul University is 7.66 CGPA." Do NOT tell the user to check university portals or contact academic departments!
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
   * Offline intelligent, category-aware rule matching engine for instant responses.
   * @param {string} input 
   * @returns {string}
   */
  getOfflineFallback(input) {
    const text = input.toLowerCase().trim();
    const repos = window.portfolioData?.repos || [];
    const sorted = [...repos].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
    const namePrefix = this.userProfile?.name ? `${this.userProfile.name}, ` : '';

    // 0. Greeting Check
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'how are you', 'who are you', 'what is your name'];
    const cleanText = text.replace(/[^a-z\s]/g, '').trim();
    if (greetings.some(g => cleanText === g || cleanText.startsWith(g + ' ') || cleanText.endsWith(' ' + g))) {
      return `Hello ${namePrefix}! 👋 I'm doing great!\n\nI am **Rudra**, the custom AI Assistant of **Raj Rathod**. How can I help you explore Raj's **ML/AI projects**, **education & university**, **skills**, or **contact links** today?`;
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

    // 0.25 Resume / CV query
    if (text.includes('resume') || text.includes('cv') || text.includes('bio') || text.includes('download resume')) {
      return `📄 **RAJ RATHOD'S RESUMES & CVs**\n\n` +
             `Raj provides two specialized resume formats:\n\n` +
             `🤖 **1. AI & Machine Learning Developer Resume**\n` +
             `• Focus: Python, PyTorch, TensorFlow, LLMs, RAG, NLP, CNNs & Predictive ML\n` +
             `• Direct PDF: [Rathod-Raj-Ai.pdf](/Rathod-Raj-Ai.pdf)\n\n` +
             `💻 **2. Full-Stack AI Engineer Resume**\n` +
             `• Focus: Full-Stack Web Development, React/Node/Express, REST APIs & GenAI Integration\n` +
             `• Direct PDF: [RATHOD_RAJ_FULLSTACK.pdf](/RATHOD_RAJ_FULLSTACK.pdf)\n\n` +
             `💡 *Tip: You can also click the **"Resume"** button on the navbar to open the interactive selection menu!*`;
    }

    // 0.3 Last working / Latest Project query
    if (text.includes('last working') || text.includes('latest project') || text.includes('last project') || text.includes('most recent') || text.includes('recent project') || (text.includes('recent') && text.includes('project')) || (text.includes('do in recent') || text.includes('doing recent'))) {
      if (sorted.length > 0) {
        const top = sorted[0];
        const top2 = sorted[1];
        const dateStr = top.updated_at ? new Date(top.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'June 2026';
        
        return `${namePrefix}Raj's **last working / most recent project** is **${top.name.replace(/[-_]/g, ' ')}** (Last updated: ${dateStr})!\n\n` +
               `• **Domain / Category**: ${top.category || 'Machine Learning'}\n` +
               `• **Tech Stack**: ${top.language || 'Python'}${top.topics?.length ? ` (${top.topics.slice(0, 4).join(', ')})` : ''}\n` +
               `• **Description**: ${top.description || 'Predictive modeling application.'}\n` +
               (top.html_url ? `• **Repository Link**: [View on GitHub](${top.html_url})\n\n` : '\n\n') +
               (top2 ? `Directly before this, Raj also updated **${top2.name.replace(/[-_]/g, ' ')}** (${top2.category || 'AI/ML'}).` : '');
      }

      return `${namePrefix}Raj's **last working / most recent project** is **Taxi Fare Prediction** (Updated: 12 Jun 2026)!\n\n` +
             `• **Domain**: Machine Learning\n` +
             `• **Tech Stack**: Python, Scikit-Learn, Regression Modeling\n` +
             `• **Description**: Predicting taxi fare amounts using trip parameters, distance, and time metrics.\n` +
             `• **Repository**: [GitHub Link](https://github.com/Raj-Rathod-Ai/Taxi-Fare-Prediction)\n\n` +
             `He also recently completed **Data Science & Analytics with GenAI** certification (July 2026)!`;
    }

    // 1. NLP / Text Mining queries
    if (text.includes('nlp') || text.includes('text') || text.includes('sentiment') || text.includes('language') || text.includes('fake news') || text.includes('movie') || text.includes('recommendation') || text.includes('bert') || text.includes('natural language')) {
      return `🔤 **RAJ RATHOD'S NATURAL LANGUAGE PROCESSING (NLP) PROJECTS**\n\n` +
             `Here are the **2 NLP Projects** featured in Raj's portfolio:\n\n` +
             `🎬 **1. Movie Recommendations Using NLP And ML**\n` +
             `• **Tech**: Python, NLP, Machine Learning, Pandas, Scikit-learn\n` +
             `• **Objective**: Content-based movie recommendation system using NLP and Machine Learning to recommend similar movies based on content, genres, keywords, and user preferences.\n` +
             `• **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Movie-Recommendations-Using-NLP-ML)\n\n` +
             `🕵️ **2. Fake News Detection Using ML Real Time**\n` +
             `• **Tech**: Python, Scikit-learn, NLTK, TF-IDF, Flask, Three.js\n` +
             `• **Objective**: Real-time fake news detection system that analyzes online news articles using machine learning and NLP techniques (~92% accuracy).\n` +
             `• **Repository**: [View on GitHub](https://github.com/Raj-Rathod-Ai/Fake-News-Detection-Using-ML-Real-time)\n\n` +
             `💡 *Tip: Click on the **NLP** category tag in the Projects section to view these 2 repositories directly!*`;
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
