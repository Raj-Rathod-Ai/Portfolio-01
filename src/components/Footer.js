import { navigate } from '../router.js';

/**
 * Footer component rendering the standard page footer.
 */
export class Footer {
  /**
   * Render the HTML string for the footer.
   * @returns {string} Footer markup.
   */
  render() {
    return `
      <footer class="border-t border-white/5 py-10 px-6 mt-12 relative z-10">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-inter text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <i class="fa-solid fa-brain text-white text-[10px]"></i>
            </div>
            <span class="font-jakarta font-bold text-gray-300">Raj Rathod</span>
          </div>
          <p>&copy; 2026 Raj Rathod · AI & Machine Learning Developer · Gujarat, India</p>
          <div class="flex gap-5 footer-links">
            <a href="#about" class="hover:text-gray-300 transition-colors footer-sec-link" data-section="about">About</a>
            <a href="#projects" class="hover:text-gray-300 transition-colors footer-proj-link">Projects</a>
            <a href="#contact" class="hover:text-gray-300 transition-colors footer-sec-link" data-section="contact">Contact</a>
          </div>
        </div>
      </footer>
    `;
  }

  /**
   * Bind events for footer nav.
   */
  setup() {
    const handleFooterLink = async (e, sectionId) => {
      e.preventDefault();
      const isHome = window.location.pathname === '/';
      if (!isHome) {
        await navigate('/');
      }
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 64;
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };

    document.querySelectorAll('.footer-sec-link').forEach(link => {
      const section = link.getAttribute('data-section');
      link.addEventListener('click', (e) => handleFooterLink(e, section));
    });

    document.querySelectorAll('.footer-proj-link').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const isHome = window.location.pathname === '/';
        if (isHome) {
          const el = document.getElementById('projects');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          await navigate('/projects');
          setTimeout(() => {
            const el = document.getElementById('projects');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 200);
        }
      });
    });
  }
}
