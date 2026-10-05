/**
 * Navbar Component - Pranay-Inspired Floating Header & Dynamic Menu for Raj Rathod.
 * Features:
 * - Left: Floating circular MusicPlayer with background audio (song-1.mp3, song-2.mp3)
 * - Right: Floating glass pill buttons:
 *    - [ LIGHT / DARK ] theme toggle
 *    - [ LET'S TALK • ] contact button
 *    - [ MENU •• ] dropdown menu button with animated dots
 * - Slide-down floating menu card overlay with "Got an idea? Let's talk" quick actions:
 *    - "CHAT ON EMAIL" & "CHAT ON WHATSAPP" (no raw numbers or emails displayed)
 * - Mobile floating bar with compact icons and full-screen drawer
 * - 100% responsive across all screen sizes
 */
export class Navbar {
  render() {
    return `
      <!-- Fixed Floating Top Navigation -->
      <header id="site-header" class="fixed top-0 left-0 w-full z-[100001] px-4 sm:px-8 lg:px-14 py-4 lg:py-8 pointer-events-none select-none">
        
        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center justify-between w-full">
          <!-- Left: Music Player Button -->
          <div class="pointer-events-auto">
            <button id="music-player-btn" type="button" aria-label="Toggle background music" class="nav_btn_sm">
              <svg id="music-icon-on" class="w-4 h-4 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              <svg id="music-icon-off" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
                <line x1="2" y1="2" x2="22" y2="22"></line>
              </svg>
            </button>
            <audio id="bg-audio" preload="none"></audio>
          </div>

          <!-- Right: Floating Action Pills Group -->
          <div class="relative flex items-center font-display pointer-events-auto">
            
            <!-- Theme Toggle Pill -->
            <button id="pranay-theme-btn" type="button" class="nav_btn_lg nav_btn_light" aria-label="Toggle theme">
              <svg id="theme-sun-icon" class="w-4 h-4 mr-1.5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
              <svg id="theme-moon-icon" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span id="theme-label-text">LIGHT</span>
            </button>

            <!-- Let's Talk Pill -->
            <a href="#contact-section" class="nav_btn_lg nav_btn_dark group" aria-label="Contact Raj Rathod">
              <span class="mr-1 group-hover:translate-x-0.5 transition-transform">LET'S TALK</span>
              <span>&nbsp;•</span>
            </a>

            <!-- Menu Button -->
            <div class="relative">
              <button id="pranay-menu-btn" type="button" class="nav_btn_lg nav_btn_glass" aria-label="Toggle menu" aria-expanded="false">
                <span id="menu-btn-text">MENU</span>
                <span id="menu-btn-dots" class="ml-1.5 transition-transform duration-300 inline-block font-bold">•&nbsp;•</span>
              </button>

              <!-- Dropdown Menu Card -->
              <div id="pranay-menu-card" class="hidden select-none z-[100005]">
                <!-- Navigation items -->
                <div class="rounded-2xl bg-bg-alt text-fg flex flex-col font-display text-xl sm:text-2xl p-6 sm:p-7 shadow-2xl border border-theme-border">
                  <a href="#hero-section" class="pranay-menu-link flex items-center justify-between pb-3 hover:text-accent transition-colors" data-target="hero-section">
                    <span>HOME</span>
                    <span class="text-fg-muted">•</span>
                  </a>
                  <a href="#about" class="pranay-menu-link flex items-center justify-between py-3 hover:text-accent transition-colors" data-target="about">
                    <span>ABOUT</span>
                    <span class="text-fg-muted">•</span>
                  </a>
                  <a href="#tech-orbit" class="pranay-menu-link flex items-center justify-between py-3 hover:text-accent transition-colors" data-target="tech-orbit">
                    <span>TECH STACK</span>
                    <span class="text-fg-muted">•</span>
                  </a>
                  <a href="#projects-section" class="pranay-menu-link flex items-center justify-between py-3 hover:text-accent transition-colors" data-target="projects-section">
                    <span>WORK</span>
                    <span class="text-fg-muted">•</span>
                  </a>
                  <a href="#gallery-section" class="pranay-menu-link flex items-center justify-between py-3 hover:text-accent transition-colors" data-target="gallery-section">
                    <span>GALLERY</span>
                    <span class="text-fg-muted">•</span>
                  </a>
                  <a href="#contact-section" class="pranay-menu-link flex items-center justify-between pt-3 hover:text-accent transition-colors" data-target="contact-section">
                    <span>CONTACT</span>
                    <span class="text-fg-muted">•</span>
                  </a>
                </div>

                <!-- Lower action box -->
                <div class="rounded-2xl bg-bg-alt text-fg flex flex-col p-6 sm:p-7 my-2 shadow-2xl border border-theme-border">
                  <div class="font-display text-2xl font-semibold leading-tight">
                    Got an idea?<br>Let's talk.
                  </div>
                  <div class="flex flex-col gap-2.5 mt-5">
                    <a href="mailto:rathodraj1504@gmail.com" class="flex items-center justify-between bg-fg text-bg rounded-xl px-4 py-3 text-xs tracking-widest font-semibold transition-transform duration-200 hover:-translate-y-0.5">
                      <span>CHAT ON EMAIL</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                    <a href="/api/whatsapp" target="_blank" rel="noreferrer" class="flex items-center justify-between border-2 border-fg text-fg rounded-xl px-4 py-3 text-xs tracking-widest font-semibold transition-colors duration-200 hover:bg-accent-soft">
                      <span>CHAT ON WHATSAPP</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                    <button type="button" class="resume-modal-trigger flex items-center justify-between border-2 border-accent text-accent rounded-xl px-4 py-3 text-xs tracking-widest font-semibold transition-colors duration-200 hover:bg-accent hover:text-white cursor-pointer">
                      <span>RESUME (CV)</span>
                      <span aria-hidden="true">📄</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Mobile Top Floating Bar -->
        <div class="lg:hidden flex items-center justify-between w-full pointer-events-auto">
          <a href="#hero-section" class="tracking-wider font-bold text-2xl text-fg font-hero" style="letter-spacing: -0.03em;">
            RAJ
          </a>
          <div class="flex items-center gap-1 sm:gap-2">
            <button id="mobile-music-btn" class="nav_btn_sm" aria-label="Toggle background music">
              🎵
            </button>
            <button id="mobile-theme-btn" class="nav_btn_sm" aria-label="Toggle theme">
              ☀️
            </button>
            <button id="mobile-menu-btn" class="nav_btn_sm" aria-label="Toggle navigation menu">
              <span id="mobile-dots" class="text-xs font-bold">⬤ ⬤</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Fullscreen Menu Drawer -->
      <div id="mobile-menu-drawer" class="fixed inset-0 z-[100000] lg:hidden bg-bg hidden transition-opacity duration-300">
        <div class="h-full w-full flex flex-col pt-24 pb-8 px-6 overflow-y-auto">
          <nav class="flex flex-col gap-1">
            <a href="#hero-section" class="mobile-nav-link flex items-center justify-between py-4 border-b border-theme-border text-fg text-2xl font-semibold">
              <span>HOME</span>
              <span class="text-fg-muted text-sm font-suisse-mono">01</span>
            </a>
            <a href="#about" class="mobile-nav-link flex items-center justify-between py-4 border-b border-theme-border text-fg text-2xl font-semibold">
              <span>ABOUT</span>
              <span class="text-fg-muted text-sm font-suisse-mono">02</span>
            </a>
            <a href="#tech-orbit" class="mobile-nav-link flex items-center justify-between py-4 border-b border-theme-border text-fg text-2xl font-semibold">
              <span>TECH STACK</span>
              <span class="text-fg-muted text-sm font-suisse-mono">03</span>
            </a>
            <a href="#projects-section" class="mobile-nav-link flex items-center justify-between py-4 border-b border-theme-border text-fg text-2xl font-semibold">
              <span>WORK</span>
              <span class="text-fg-muted text-sm font-suisse-mono">04</span>
            </a>
            <a href="#gallery-section" class="mobile-nav-link flex items-center justify-between py-4 border-b border-theme-border text-fg text-2xl font-semibold">
              <span>GALLERY</span>
              <span class="text-fg-muted text-sm font-suisse-mono">05</span>
            </a>
            <a href="#contact-section" class="mobile-nav-link flex items-center justify-between py-4 border-b border-theme-border text-fg text-2xl font-semibold">
              <span>CONTACT</span>
              <span class="text-fg-muted text-sm font-suisse-mono">06</span>
            </a>
          </nav>

          <div class="mt-auto pt-8 flex flex-col gap-3">
            <p class="text-fg-muted text-xs tracking-[0.2em] uppercase font-label">Get in touch</p>
            <a href="mailto:rathodraj1504@gmail.com" class="flex items-center justify-between bg-fg text-bg rounded-full px-5 py-3.5 text-xs tracking-widest font-semibold transition-transform hover:-translate-y-0.5">
              <span>CHAT ON EMAIL</span>
              <span>↗</span>
            </a>
            <a href="/api/whatsapp" target="_blank" rel="noreferrer" class="flex items-center justify-between border-2 border-fg text-fg rounded-full px-5 py-3.5 text-xs tracking-widest font-semibold transition-colors hover:bg-accent-soft">
              <span>CHAT ON WHATSAPP</span>
              <span>↗</span>
            </a>
            <button type="button" class="resume-modal-trigger flex items-center justify-between border-2 border-accent text-accent rounded-full px-5 py-3.5 text-xs tracking-widest font-semibold cursor-pointer hover:bg-accent hover:text-white">
              <span>RESUME (CV)</span>
              <span>📄</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  setup() {
    // 1. Theme Management (Light vs Dark)
    const themeBtn = document.getElementById('pranay-theme-btn');
    const mobileThemeBtn = document.getElementById('mobile-theme-btn');
    const sunIcon = document.getElementById('theme-sun-icon');
    const moonIcon = document.getElementById('theme-moon-icon');
    const themeLabel = document.getElementById('theme-label-text');

    const updateThemeUI = (theme) => {
      const isDark = theme === 'dark';
      document.documentElement.dataset.theme = theme;
      if (isDark) {
        document.documentElement.classList.add('dark');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        if (themeLabel) themeLabel.textContent = 'LIGHT';
        if (mobileThemeBtn) mobileThemeBtn.textContent = '☀️';
      } else {
        document.documentElement.classList.remove('dark');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (themeLabel) themeLabel.textContent = 'DARK';
        if (mobileThemeBtn) mobileThemeBtn.textContent = '🌙';
      }
    };

    const urlTheme = new URLSearchParams(window.location.search).get('theme');
    const savedTheme = urlTheme || localStorage.getItem('theme') || 'dark';
    updateThemeUI(savedTheme);

    const toggleTheme = () => {
      const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      updateThemeUI(next);
    };

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

    // 2. Background Music Player (song-1.mp3, song-2.mp3)
    const audio = document.getElementById('bg-audio');
    const musicBtn = document.getElementById('music-player-btn');
    const mobileMusicBtn = document.getElementById('mobile-music-btn');
    const musicIconOn = document.getElementById('music-icon-on');
    const musicIconOff = document.getElementById('music-icon-off');

    const playlist = ['/music/song-1.mp3', '/music/song-2.mp3'];
    let playlistIdx = 0;
    let isPlaying = false;

    if (audio) {
      audio.volume = 0.45;
      audio.addEventListener('ended', () => {
        playlistIdx = (playlistIdx + 1) % playlist.length;
        audio.src = playlist[playlistIdx];
        audio.play().catch(() => {});
      });
    }

    const toggleMusic = () => {
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        if (musicIconOn) musicIconOn.classList.add('hidden');
        if (musicIconOff) musicIconOff.classList.remove('hidden');
        if (mobileMusicBtn) mobileMusicBtn.textContent = '🎵';
      } else {
        if (!audio.src) audio.src = playlist[playlistIdx];
        audio.play().then(() => {
          isPlaying = true;
          if (musicIconOn) musicIconOn.classList.remove('hidden');
          if (musicIconOff) musicIconOff.classList.add('hidden');
          if (mobileMusicBtn) mobileMusicBtn.textContent = '⏸️';
        }).catch(() => {
          isPlaying = false;
        });
      }
    };

    if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
    if (mobileMusicBtn) mobileMusicBtn.addEventListener('click', toggleMusic);

    // 3. Desktop Menu Button & Dropdown Card
    const menuBtn = document.getElementById('pranay-menu-btn');
    const menuDots = document.getElementById('menu-btn-dots');
    const menuCard = document.getElementById('pranay-menu-card');

    let menuOpen = false;

    const setMenuOpen = (open) => {
      menuOpen = open;
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', String(open));
        const btnText = document.getElementById('menu-btn-text');
        if (btnText) btnText.textContent = open ? 'CLOSE' : 'MENU';
      }
      if (menuDots) {
        menuDots.style.transform = open ? 'rotate(90deg)' : 'rotate(0deg)';
      }
      if (menuCard) {
        if (open) {
          menuCard.classList.remove('hidden');
        } else {
          menuCard.classList.add('hidden');
        }
      }
    };

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
      });
      menuBtn.addEventListener('mouseenter', () => {
        if (!menuOpen && menuDots) menuDots.style.transform = 'rotate(90deg)';
      });
      menuBtn.addEventListener('mouseleave', () => {
        if (!menuOpen && menuDots) menuDots.style.transform = 'rotate(0deg)';
      });
    }

    document.addEventListener('click', (e) => {
      if (menuOpen && menuCard && !menuCard.contains(e.target) && !menuBtn.contains(e.target)) {
        setMenuOpen(false);
      }
    });

    // Smooth scroll for menu links
    const menuLinks = document.querySelectorAll('.pranay-menu-link, .mobile-nav-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('data-target') || (link.getAttribute('href') || '').replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          setMenuOpen(false);
          closeMobileMenu();
        }
      });
    });

    // 4. Mobile Menu Drawer
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileDots = document.getElementById('mobile-dots');
    let mobileOpen = false;

    const closeMobileMenu = () => {
      mobileOpen = false;
      if (mobileDrawer) mobileDrawer.classList.add('hidden');
      if (mobileDots) mobileDots.textContent = '⬤ ⬤';
      document.body.style.overflow = '';
    };

    const openMobileMenu = () => {
      mobileOpen = true;
      if (mobileDrawer) mobileDrawer.classList.remove('hidden');
      if (mobileDots) mobileDots.textContent = '✕';
      document.body.style.overflow = 'hidden';
    };

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        if (mobileOpen) closeMobileMenu();
        else openMobileMenu();
      });
    }
  }
}
