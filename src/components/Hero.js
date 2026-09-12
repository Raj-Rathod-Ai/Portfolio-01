import { navigate } from '../router.js';

/**
 * Hero component displaying the main intro section and typing animation.
 * UI upgraded with Kanit font, gradient heading, magnetic portrait, premium button.
 */
export class Hero {
  /**
   * Render the HTML string for the Hero section.
   * @returns {string} Hero HTML markup.
   */
  render() {
    return `
      <section id="hero" class="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden" style="background:#0C0C0C;">
        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20">
          
          <!-- Headline column block -->
          <div class="lg:col-span-7 space-y-7 scroll-reveal reveal-zoom-fade">
            <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 animate-pulse">
              <span class="w-1.5 h-1.5 rounded-full bg-teal"></span>
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

            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-primary/50 transition-all"><i class="fa-brands fa-python text-sky"></i> Python</span>
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-secondary/50 transition-all"><i class="fa-solid fa-brain text-secondary"></i> TensorFlow</span>
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-rose/50 transition-all"><i class="fa-solid fa-fire text-rose"></i> PyTorch</span>
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-teal/50 transition-all"><i class="fa-solid fa-chart-line text-teal"></i> Scikit-learn</span>
              <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5 hover:border-accent/50 transition-all"><i class="fa-solid fa-database text-accent"></i> Streamlit</span>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <a href="#projects" class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary font-jakarta font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 hero-projects-btn">
                View Projects <i class="fa-solid fa-arrow-right text-sm"></i>
              </a>
              <button class="resume-modal-trigger px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 font-jakarta font-semibold text-gray-300 hover:text-white hover:border-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <i class="fa-solid fa-file-arrow-down text-sm text-primary"></i> Download Resume
              </button>
              <a href="#contact" class="btn-contact-premium px-8 py-3.5 resume-contact-scroll" style="font-size:0.85rem;">
                Contact Me
              </a>
            </div>
          </div>

          <!-- Interactive profile portrait column card -->
          <div class="lg:col-span-5 flex justify-center scroll-reveal reveal-zoom-fade delay-100">
            <div class="relative group max-w-xs w-full">
              <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl blur-3xl opacity-15 group-hover:opacity-30 transition-opacity duration-700"></div>
              <div class="relative border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center space-y-5 spotlight-card" style="background: rgba(18,18,20,0.92);">
                <div class="relative">
                  <div id="portrait-magnet" class="magnetic-portrait-wrap">
                    <div class="w-36 h-36 rounded-full p-0.5 bg-gradient-to-tr from-primary via-secondary to-accent profile-pic-container">
                      <img src="/raj.jpeg" alt="Raj Rathod - AI &amp; Machine Learning Engineer" class="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-[filter] duration-300">
                    </div>
                  </div>
                  <div class="absolute -top-1 -right-1 w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-xs animate-bounce" style="background: rgba(18,18,20,0.9)"><i class="fa-solid fa-robot text-primary"></i></div>
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
      'AI & Machine Learning Developer',
      'Deep Learning Specialist',
      'Computer Vision Developer',
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
        el.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        delay = 50;
      } else {
        el.textContent = currentRole.substring(0, charIdx + 1);
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
