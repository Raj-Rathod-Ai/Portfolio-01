import { navigate } from '../router.js';

/**
 * Navbar component class managing global header links and mobile menu triggers.
 */
export class Navbar {
  /**
   * Render the HTML string for the header navbar and mobile menu.
   * @returns {string} Navbar HTML markup.
   */
  render() {
    return `
      <header class="fixed top-0 left-0 right-0 z-[40] border-b border-white/5 backdrop-blur-xl" style="background: rgba(13,17,23,0.85)">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center space-x-2.5 hover:opacity-80 transition-opacity logo-nav-btn">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <i class="fa-solid fa-brain text-white text-sm"></i>
            </div>
            <span class="font-jakarta font-bold text-lg text-gray-100">Raj Rathod</span>
          </a>

          <nav class="hidden md:flex items-center space-x-8 font-inter text-sm font-medium navbar-links">
            <a href="#about" class="text-gray-400 hover:text-gray-100 transition-colors nav-section-link" data-section="about">About</a>
            <a href="#skills" class="text-gray-400 hover:text-gray-100 transition-colors nav-section-link" data-section="skills">Skills</a>
            <a href="#projects" class="text-gray-400 hover:text-gray-100 transition-colors nav-projects-link" data-section="projects">Projects</a>
            <a href="#github" class="text-gray-400 hover:text-gray-100 transition-colors nav-section-link" data-section="github">GitHub</a>
            <a href="#reviews" class="text-gray-400 hover:text-gray-100 transition-colors nav-section-link" data-section="reviews">Reviews</a>
            <a href="#contact" class="text-gray-400 hover:text-gray-100 transition-colors nav-section-link" data-section="contact">Contact</a>
          </nav>

          <div class="flex items-center space-x-3">
            <button class="resume-modal-trigger hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary font-jakarta text-xs font-semibold text-white shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <i class="fa-solid fa-file-arrow-down"></i>
              <span>Resume</span>
            </button>
            <button id="mobile-menu-btn" class="md:hidden w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white">
              <i class="fa-solid fa-bars text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Overlay Backdrop -->
      <div id="mobile-menu-backdrop" class="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300"></div>

      <!-- Mobile navigation panel -->
      <div id="mobile-menu" class="fixed inset-y-0 right-0 z-[50] w-72 bg-[#0d1117] border-l border-white/10 p-6 flex flex-col transform translate-x-full transition-transform duration-300">
        <div class="flex justify-between items-center mb-8">
          <span class="font-jakarta font-bold text-gray-100">Menu</span>
          <button id="mobile-menu-close" class="text-gray-500 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
        <nav class="flex flex-col space-y-1">
          <a href="#about" class="py-3 px-4 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors font-medium mobile-nav-link" data-section="about">About</a>
          <a href="#skills" class="py-3 px-4 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors font-medium mobile-nav-link" data-section="skills">Skills</a>
          <a href="#projects" class="py-3 px-4 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors font-medium mobile-nav-projects-link" data-section="projects">Projects</a>
          <a href="#github" class="py-3 px-4 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors font-medium mobile-nav-link" data-section="github">GitHub</a>
          <a href="#reviews" class="py-3 px-4 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors font-medium mobile-nav-link" data-section="reviews">Reviews</a>
          <a href="#contact" class="py-3 px-4 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors font-medium mobile-nav-link" data-section="contact">Contact</a>
          <button class="resume-modal-trigger w-full py-3 px-4 rounded-lg text-primary hover:bg-white/5 transition-colors font-medium flex items-center gap-2 text-left cursor-pointer">
            <i class="fa-solid fa-file-arrow-down text-sm"></i> Download Resume
          </button>
        </nav>
      </div>
    `;
  }

  /**
   * Bind event listeners for navbar navigation, mobile toggles, and scroll spying.
   */
  setup() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileClose = document.getElementById('mobile-menu-close');
    const backdrop = document.getElementById('mobile-menu-backdrop');

    const openMobileMenu = () => {
      if (mobileMenu) mobileMenu.classList.remove('translate-x-full');
      if (backdrop) {
        backdrop.classList.remove('hidden');
        setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
      }
    };

    const closeMobileMenu = () => {
      if (mobileMenu) mobileMenu.classList.add('translate-x-full');
      if (backdrop) {
        backdrop.classList.add('opacity-0');
        setTimeout(() => backdrop.classList.add('hidden'), 300);
      }
    };

    if (mobileBtn) mobileBtn.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (backdrop) backdrop.addEventListener('click', closeMobileMenu);

    // Intercept clicks on logo
    document.querySelectorAll('.logo-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Intercept section links (About, Skills, GitHub, Reviews, Contact)
    const handleNavClick = async (e, sectionId) => {
      e.preventDefault();
      closeMobileMenu();

      const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
      
      if (!isHome) {
        // Go home first, then scroll
        await navigate('/');
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 300);
      } else {
        scrollToSection(sectionId);
      }
    };

    const scrollToSection = (sectionId) => {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 64; // Header height
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    document.querySelectorAll('.nav-section-link, .mobile-nav-link').forEach(link => {
      const section = link.getAttribute('data-section');
      link.addEventListener('click', (e) => handleNavClick(e, section));
    });

    // Intercept Projects link click
    document.querySelectorAll('.nav-projects-link, .mobile-nav-projects-link').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        closeMobileMenu();
        
        const isHome = window.location.pathname === '/';
        const isProjects = window.location.pathname.startsWith('/projects');

        if (isHome) {
          scrollToSection('projects');
        } else if (isProjects && window.location.pathname !== '/projects') {
          // If we are deep inside a category, go back to project index page
          await navigate('/projects');
          setTimeout(() => scrollToSection('projects'), 100);
        } else {
          // If we are elsewhere, go to home and scroll to projects
          await navigate('/');
          setTimeout(() => scrollToSection('projects'), 300);
        }
      });
    });

    // Scroll Spying to highlight active navbar section
    const spySections = ['about', 'skills', 'projects', 'github', 'reviews', 'contact'];
    const navLinks = document.querySelectorAll('.nav-section-link, .nav-projects-link');

    const updateActiveLink = () => {
      const isHome = window.location.pathname === '/';
      if (!isHome) {
        navLinks.forEach(link => link.classList.remove('text-gray-100'));
        navLinks.forEach(link => link.classList.add('text-gray-400'));
        return;
      }

      let currentActive = '';
      const scrollPosition = window.scrollY + 120; // Offset

      for (const sectionId of spySections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentActive = sectionId;
            break;
          }
        }
      }

      navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (section === currentActive) {
          link.classList.remove('text-gray-400');
          link.classList.add('text-gray-100');
        } else {
          link.classList.remove('text-gray-100');
          link.classList.add('text-gray-400');
        }
      });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial check
  }
}
