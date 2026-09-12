import { navigate } from '../router.js';

/**
 * Hero component displaying the main intro section and typing animation.
 * UI upgraded with Kanit font, gradient heading, magnetic portrait,
 * floating tech orbs, orbital rings, and premium buttons.
 */
export class Hero {
  /**
   * Render the HTML string for the Hero section.
   * @returns {string} Hero HTML markup.
   */
  render() {
    return `
      <section id="hero" class="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden" style="background:#0C0C0C;">

        <!-- ── Floating Tech Icon Orbs (MotionSites-inspired) ─── -->
        <div class="hero-orb-field" aria-hidden="true">
          <!-- Python -->
          <div class="hero-orb" style="left:6%;top:19%;width:56px;height:56px;box-shadow:0 0 32px rgba(59,130,246,0.25);animation-duration:7s;animation-delay:0s;">
            <i class="fa-brands fa-python" style="color:#3b82f6;font-size:23px;"></i>
          </div>
          <!-- PyTorch / Fire -->
          <div class="hero-orb" style="left:87%;top:22%;width:50px;height:50px;box-shadow:0 0 28px rgba(239,68,68,0.25);animation-duration:9s;animation-delay:-2.5s;">
            <i class="fa-solid fa-fire" style="color:#ef4444;font-size:20px;"></i>
          </div>
          <!-- ML / Chart -->
          <div class="hero-orb" style="left:4%;top:73%;width:47px;height:47px;box-shadow:0 0 28px rgba(16,185,129,0.25);animation-duration:8s;animation-delay:-4s;">
            <i class="fa-solid fa-chart-line" style="color:#10b981;font-size:18px;"></i>
          </div>
          <!-- Computer Vision / Eye -->
          <div class="hero-orb" style="left:83%;top:69%;width:52px;height:52px;box-shadow:0 0 28px rgba(20,184,166,0.25);animation-duration:11s;animation-delay:-1s;">
            <i class="fa-solid fa-eye" style="color:#14b8a6;font-size:21px;"></i>
          </div>
          <!-- Transformers / Robot -->
          <div class="hero-orb" style="left:47%;top:7%;width:50px;height:50px;box-shadow:0 0 28px rgba(168,85,247,0.25);animation-duration:6.5s;animation-delay:-5s;">
            <i class="fa-solid fa-robot" style="color:#a855f7;font-size:21px;"></i>
          </div>
          <!-- Deep Learning / Brain -->
          <div class="hero-orb" style="left:15%;top:46%;width:44px;height:44px;box-shadow:0 0 24px rgba(249,115,22,0.25);animation-duration:10s;animation-delay:-3s;">
            <i class="fa-solid fa-brain" style="color:#f97316;font-size:18px;"></i>
          </div>
          <!-- Database / MongoDB -->
          <div class="hero-orb" style="left:78%;top:47%;width:45px;height:45px;box-shadow:0 0 24px rgba(34,197,94,0.25);animation-duration:8.5s;animation-delay:-6s;">
            <i class="fa-solid fa-database" style="color:#22c55e;font-size:18px;"></i>
          </div>
        </div>

        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20">
          
          <!-- Headline column block -->
          <div class="lg:col-span-7 space-y-7 scroll-reveal reveal-zoom-fade">
            <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
              <span class="available-dot"></span>
              <span class="font-mono text-xs text-teal">Available for opportunities</span>
            </div>
            
            <div class="space-y-3">
              <h1 style="font-family:'Kanit',sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-0.03em;line-height:1;font-size:clamp(3.5rem,9vw,7rem);" class="hero-heading">
                Raj Rathod
              </h1>
              <p class="text-xl sm:text-2xl font-jakarta font-semibold text-gray-400">
                <span id="typewriter-role">AI &amp; Machine Learning Developer</span><span class="typewriter-cursor">|</span>
              </p>
            </div>
            
            <p class="font-inter text-base text-gray-400 max-w-xl leading-relaxed">
              Building intelligent systems that transform raw data into real-world solutions. Specializing in Deep Learning, NLP, Computer Vision, and Predictive Analytics.
            </p>

            <!-- Tech badge pills with icon motion -->
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default group">
                <i class="fa-brands fa-python text-sky icon-float" style="color:#3b82f6;animation-delay:0s;"></i> Python
              </span>
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-default">
                <i class="fa-solid fa-brain text-secondary icon-float" style="color:#B600A8;animation-delay:0.4s;"></i> TensorFlow
              </span>
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all cursor-default">
                <i class="fa-solid fa-fire icon-float" style="color:#ef4444;animation-delay:0.8s;"></i> PyTorch
              </span>
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-teal/50 hover:bg-teal-500/5 transition-all cursor-default">
                <i class="fa-solid fa-chart-line text-teal icon-float" style="color:#14b8a6;animation-delay:1.2s;"></i> Scikit-learn
              </span>
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-accent/50 hover:bg-accent/5 transition-all cursor-default">
                <i class="fa-solid fa-database text-accent icon-float" style="color:#0ea5e9;animation-delay:1.6s;"></i> Streamlit
              </span>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <a href="#projects" class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary font-jakarta font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 hero-projects-btn">
                View Projects <i class="fa-solid fa-arrow-right text-sm"></i>
              </a>
              <button class="resume-modal-trigger px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 font-jakarta font-semibold text-gray-300 hover:text-white hover:border-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <i class="fa-solid fa-file-arrow-down text-sm text-primary icon-float" style="animation-delay:0.5s;"></i> Download Resume
              </button>
              <a href="#contact" class="btn-contact-premium px-8 py-3.5 resume-contact-scroll" style="font-size:0.85rem;">
                Contact Me
              </a>
            </div>
          </div>

          <!-- Interactive profile portrait column card with orbital rings -->
          <div class="lg:col-span-5 flex justify-center scroll-reveal reveal-zoom-fade delay-100">
            <div class="relative group max-w-xs w-full">
              <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-3xl opacity-15 group-hover:opacity-30 transition-opacity duration-700"></div>
              <div class="relative border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center space-y-5 spotlight-card" style="background: rgba(18,18,20,0.92);">
                <!-- Portrait with orbital rings -->
                <div class="relative" style="width:144px;height:144px;">
                  <!-- Orbital ring 1 -->
                  <div class="portrait-ring" style="width:188px;height:188px;margin-left:-22px;margin-top:-22px;"></div>
                  <!-- Orbital ring 2 -->
                  <div class="portrait-ring portrait-ring-outer" style="width:228px;height:228px;margin-left:-42px;margin-top:-42px;"></div>
                  <!-- Magnetic portrait -->
                  <div id="portrait-magnet" class="magnetic-portrait-wrap" style="position:relative;z-index:2;">
                    <div class="w-36 h-36 rounded-full p-0.5 bg-gradient-to-tr from-primary via-secondary to-accent profile-pic-container">
                      <img src="/raj.jpeg" alt="Raj Rathod - AI &amp; Machine Learning Engineer" class="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-[filter] duration-300">
                    </div>
                  </div>
                  <!-- Animated robot badge -->
                  <div class="absolute -top-1 -right-1 w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-xs" style="background: rgba(18,18,20,0.95);z-index:3;">
                    <i class="fa-solid fa-robot text-primary icon-spin-slow" style="font-size:13px;"></i>
                  </div>
                </div>
                <div>
                  <h3 style="font-family:'Kanit',sans-serif;font-weight:700;font-size:1.2rem;" class="text-gray-100">Raj Rathod</h3>
                  <p class="font-mono text-xs text-teal mt-0.5">AI &amp; ML Developer</p>
                </div>
                <hr class="w-full border-white/10">
                <div class="grid grid-cols-2 gap-4 w-full text-left text-xs">
                  <div>
                    <span class="block text-gray-600 text-[10px] uppercase tracking-widest mb-0.5">Specialization</span>
                    <span class="text-gray-200 font-semibold font-mono text-[11px]">CV &amp; NLP</span>
                  </div>
                  <div class="text-right">
                    <span class="block text-gray-600 text-[10px] uppercase tracking-widest mb-0.5">Location</span>
                    <span class="text-gray-200 font-semibold font-mono text-[10px] truncate block max-w-[120px]" title="Gujarat India">Gujarat, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Bind event listeners, trigger typewriter effect, and setup magnetic portrait.
   */
  setup() {
    // Typewriter effect
    const roles = [
      'AI &amp; Machine Learning Developer',
      'Deep Learning Specialist',
      'Computer Vision Developer',
      'NLP &amp; LLM Engineer',
      'Full-Stack Developer'
    ];
    const target = document.getElementById('typewriter-role');
    if (!target) return;

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let delay = 100;

    const type = () => {
      const currentRole = roles[roleIdx];
      const el = document.getElementById('typewriter-role');
      if (!el) return;

      if (isDeleting) {
        el.innerHTML = currentRole.substring(0, charIdx - 1);
        charIdx--;
        delay = 50;
      } else {
        el.innerHTML = currentRole.substring(0, charIdx + 1);
        charIdx++;
        delay = 100;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 500;
      }

      setTimeout(type, delay);
    };

    type();

    // Setup project section smooth scrolling when hero btn clicked
    const projectsBtn = document.querySelector('.hero-projects-btn');
    if (projectsBtn) {
      projectsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const el = document.getElementById('projects');
        if (el) {
          const offset = 64;
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    }

    // Contact scroll button
    const contactScrollBtn = document.querySelector('.resume-contact-scroll');
    if (contactScrollBtn) {
      contactScrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const el = document.getElementById('contact');
        if (el) {
          const offset = 64;
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    }

    // Magnetic portrait effect
    const magnet = document.getElementById('portrait-magnet');
    if (magnet) {
      const PADDING = 80;
      const STRENGTH = 4;

      const onMouseMove = (e) => {
        const rect = magnet.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const threshold = rect.width / 2 + PADDING;

        if (dist < threshold) {
          magnet.classList.add('active');
          magnet.style.transform = `translate3d(${dx / STRENGTH}px, ${dy / STRENGTH}px, 0)`;
        } else {
          magnet.classList.remove('active');
          magnet.style.transform = 'translate3d(0,0,0)';
        }
      };

      const onMouseLeave = () => {
        magnet.classList.remove('active');
        magnet.style.transform = 'translate3d(0,0,0)';
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mouseleave', onMouseLeave);
    }
  }
}
