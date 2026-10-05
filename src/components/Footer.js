/**
 * Footer Component - Pranay-Inspired Interactive Socials & Navigation Footer for Raj Rathod.
 * Features:
 * - Brand heading 'RAJ' with .about-accent-text
 * - Interactive 3D flip tiles spelling 'CONTACT' (GitHub, WhatsApp, LinkedIn, Instagram, LeetCode, Email, Resume)
 * - Animated top & bottom gradient beams on the tiles card
 * - Explore navigation anchors & confidential direct contact links ("Chat on WhatsApp", "Chat on Email")
 * - 100% responsive across mobile, tablet, and desktop viewports
 */
export class Footer {
  render() {
    return `
      <footer id="main-footer" class="w-full bg-bg text-fg border-t border-theme-border font-display select-none">
        <div class="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8">
          
          <!-- Left Column: Brand + blurb + CONTACT 3D flip tiles -->
          <div class="flex flex-col items-start">
            <div class="text-3xl md:text-4xl font-hero font-bold tracking-tight about-accent-text" role="heading" aria-level="3">
              RAJ
            </div>
            <p class="mt-4 text-fg-muted max-w-sm leading-relaxed font-cond text-base md:text-lg">
              Building intelligent AI systems, neural architectures, and the solutions that power them.
            </p>
            
            <!-- CONTACT 3D Flip Tiles Container with animated border beams -->
            <div class="mt-8 max-w-full overflow-x-auto no-scrollbar py-2">
              <div class="social-flip-wrapper" id="social-flip-wrapper">
                <div class="social-flip-beam-top" aria-hidden="true"></div>
                <div class="social-flip-beam-bottom" aria-hidden="true"></div>
                
                <!-- C: GitHub -->
                <a href="https://github.com/Raj-Rathod-Ai" target="_blank" rel="noopener noreferrer" class="social-flip-node" aria-label="GitHub Profile">
                  <div class="social-flip-tooltip">GitHub</div>
                  <div class="social-flip-inner">
                    <div class="social-flip-front">C</div>
                    <div class="social-flip-back"><i class="fa-brands fa-github"></i></div>
                  </div>
                </a>

                <!-- O: WhatsApp -->
                <a href="/api/whatsapp" target="_blank" rel="noopener noreferrer" class="social-flip-node" aria-label="Chat on WhatsApp">
                  <div class="social-flip-tooltip">WhatsApp</div>
                  <div class="social-flip-inner">
                    <div class="social-flip-front">O</div>
                    <div class="social-flip-back"><i class="fa-brands fa-whatsapp text-emerald-400"></i></div>
                  </div>
                </a>

                <!-- N: LinkedIn -->
                <a href="https://linkedin.com/in/raj-rathod-ai" target="_blank" rel="noopener noreferrer" class="social-flip-node" aria-label="LinkedIn Profile">
                  <div class="social-flip-tooltip">LinkedIn</div>
                  <div class="social-flip-inner">
                    <div class="social-flip-front">N</div>
                    <div class="social-flip-back"><i class="fa-brands fa-linkedin-in text-sky-400"></i></div>
                  </div>
                </a>

                <!-- T: Instagram -->
                <a href="https://www.instagram.com/its._.rudra._.19.08_/" target="_blank" rel="noopener noreferrer" class="social-flip-node" aria-label="Instagram Profile">
                  <div class="social-flip-tooltip">Instagram</div>
                  <div class="social-flip-inner">
                    <div class="social-flip-front">T</div>
                    <div class="social-flip-back"><i class="fa-brands fa-instagram text-pink-400"></i></div>
                  </div>
                </a>

                <!-- A: LeetCode -->
                <a href="https://leetcode.com/u/Rathod-Raj-Ai/" target="_blank" rel="noopener noreferrer" class="social-flip-node" aria-label="LeetCode Profile">
                  <div class="social-flip-tooltip">LeetCode</div>
                  <div class="social-flip-inner">
                    <div class="social-flip-front">A</div>
                    <div class="social-flip-back"><i class="fa-solid fa-code text-amber-400"></i></div>
                  </div>
                </a>

                <!-- C: Email -->
                <a href="mailto:rathodraj1504@gmail.com" class="social-flip-node" aria-label="Chat on Email">
                  <div class="social-flip-tooltip">Email</div>
                  <div class="social-flip-inner">
                    <div class="social-flip-front">C</div>
                    <div class="social-flip-back"><i class="fa-solid fa-envelope text-accent"></i></div>
                  </div>
                </a>

                <!-- T: Resume Modal Trigger -->
                <button type="button" class="social-flip-node resume-modal-trigger cursor-pointer" aria-label="Resume (CV)">
                  <div class="social-flip-tooltip">Resume</div>
                  <div class="social-flip-inner">
                    <div class="social-flip-front">T</div>
                    <div class="social-flip-back"><i class="fa-solid fa-file-pdf text-accent"></i></div>
                  </div>
                </button>

              </div>
            </div>
          </div>

          <!-- Right Column: Explore + Confidential Contact Links -->
          <div class="grid grid-cols-2 gap-6 sm:gap-8">
            <div class="flex flex-col gap-3">
              <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-fg-subtle mb-1 font-label">
                Explore
              </h3>
              <a href="#about" class="line-hover-link text-left font-cond text-base">
                About
              </a>
              <a href="#tech-orbit" class="line-hover-link text-left font-cond text-base">
                Tech Stack
              </a>
              <a href="#projects-section" class="line-hover-link text-left font-cond text-base">
                Projects
              </a>
              <a href="#community" class="line-hover-link text-left font-cond text-base">
                Community
              </a>
              <a href="#gallery-section" class="line-hover-link text-left font-cond text-base">
                Gallery
              </a>
              <a href="#contact-section" class="line-hover-link text-left font-cond text-base">
                Get in touch
              </a>
            </div>

            <div class="flex flex-col gap-3">
              <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-fg-subtle mb-1 font-label">
                Contact
              </h3>
              <a href="mailto:rathodraj1504@gmail.com" class="line-hover-link text-left font-cond text-base flex items-center gap-2 group">
                <i class="fa-solid fa-envelope text-accent group-hover:scale-110 transition-transform"></i>
                <span>Chat on Email</span>
              </a>
              <a href="/api/whatsapp" target="_blank" rel="noopener noreferrer" class="line-hover-link text-left font-cond text-base flex items-center gap-2 group">
                <i class="fa-brands fa-whatsapp text-emerald-400 group-hover:scale-110 transition-transform"></i>
                <span>Chat on WhatsApp</span>
              </a>
              <button type="button" class="resume-modal-trigger line-hover-link text-left font-cond text-base flex items-center gap-2 group cursor-pointer">
                <i class="fa-solid fa-file-pdf text-accent group-hover:scale-110 transition-transform"></i>
                <span>Resume (CV)</span>
              </button>
              <span class="text-xs text-fg-subtle font-cond mt-2">
                Vadodara, Gujarat · India
              </span>
            </div>
          </div>

        </div>

        <!-- Footer Bottom Bar -->
        <div class="border-t border-theme-border">
          <div class="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fg-subtle font-cond text-center sm:text-left">
            <p>© 2026 Raj Rathod. All rights reserved.</p>
            <p>Designed &amp; built by Raj Rathod</p>
          </div>
        </div>
      </footer>
    `;
  }

  setup() {
    // Smooth scroll for internal links
    const footer = document.getElementById('main-footer');
    if (!footer) return;

    footer.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Touch support for mobile: tap container to flip
    const wrapper = document.getElementById('social-flip-wrapper');
    if (wrapper) {
      let flipped = false;
      wrapper.addEventListener('click', (e) => {
        // If clicking on an anchor tag, let it navigate
        if (e.target.closest('a') || e.target.closest('button')) return;
        flipped = !flipped;
        const inners = wrapper.querySelectorAll('.social-flip-inner');
        inners.forEach((inner, idx) => {
          setTimeout(() => {
            inner.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
          }, idx * 60);
        });
      });
    }
  }
}
