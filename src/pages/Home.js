import { Hero } from '../components/Hero.js';
import { CategoryCard } from '../components/CategoryCard.js';
import { getAllCategories } from '../utils/categorize.js';

/**
 * Home page component rendering the complete landing page.
 */
export class Home {
  constructor() {
    this.hero = new Hero();
    this.categoryCard = new CategoryCard();
  }

  /**
   * Render the HTML string for the Home page.
   * @returns {string} HTML markup.
   */
  render() {
    return `
      <!-- Hero Section -->
      <div id="hero-mount">
        ${this.hero.render()}
      </div>

      <!-- ================= ABOUT ================= -->
      <section id="about" class="py-24 px-6 max-w-7xl mx-auto w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div class="lg:col-span-6 space-y-6 scroll-reveal reveal-left">
            <div class="space-y-2">
              <span class="font-mono text-xs text-primary uppercase tracking-widest">About Me</span>
              <h2 class="text-3xl sm:text-4xl font-jakarta font-extrabold text-gray-100 leading-tight">Turning Data Into<br>Intelligent Solutions</h2>
            </div>
            
            <p class="font-inter text-gray-400 leading-relaxed">
              I'm a Computer Science engineering student at Parul University, specializing in AI and Machine Learning. I love building end-to-end ML pipelines — from data preprocessing and model training to deployment with Streamlit and Vercel.
            </p>

            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl border border-white/8 p-4 bg-white/3 spotlight-card">
                <span class="block font-jakarta font-extrabold text-2xl text-primary">7.66</span>
                <span class="block text-xs text-gray-500 mt-1">B.Tech CGPA</span>
              </div>
              <div class="rounded-xl border border-white/8 p-4 bg-white/3 spotlight-card">
                <span class="block font-jakarta font-extrabold text-2xl text-secondary">10+</span>
                <span class="block text-xs text-gray-500 mt-1">Projects Built</span>
              </div>
              <div class="rounded-xl border border-white/8 p-4 bg-white/3 spotlight-card">
                <span class="block font-jakarta font-extrabold text-2xl text-accent">350+</span>
                <span class="block text-xs text-gray-500 mt-1">LeetCode Solved</span>
              </div>
              <div class="rounded-xl border border-white/8 p-4 bg-white/3 spotlight-card">
                <span class="block font-jakarta font-extrabold text-2xl text-teal">2027</span>
                <span class="block text-xs text-gray-500 mt-1">Expected Graduation</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-6 space-y-6 scroll-reveal reveal-right delay-100">
            <div class="space-y-2">
              <span class="font-mono text-xs text-secondary uppercase tracking-widest">Education</span>
              <h2 class="text-3xl sm:text-4xl font-jakarta font-extrabold text-gray-100">Academic Journey</h2>
            </div>

            <div class="relative border-l border-white/8 ml-4 pl-8 space-y-10">
              <div class="relative group">
                <div class="absolute -left-10 top-1 w-3 h-3 rounded-full border border-primary bg-darkBg timeline-dot"></div>
                <div class="rounded-xl border border-white/8 p-5 bg-white/3 group-hover:border-primary/30 transition-colors spotlight-card">
                  <div class="flex justify-between items-start gap-2 mb-2">
                    <span class="font-mono text-xs text-primary">2023 — 2027</span>
                    <span class="px-2 py-0.5 rounded-md bg-primary/10 text-[10px] text-primary font-mono border border-primary/20">GPA 7.66</span>
                  </div>
                  <h3 class="font-jakarta font-bold text-gray-100">B.Tech — Computer Science & Engineering with AI</h3>
                  <p class="text-sm text-gray-500 mt-0.5">Parul University, Vadodara</p>
                </div>
              </div>

              <div class="relative group">
                <div class="absolute -left-10 top-1 w-3 h-3 rounded-full border border-secondary bg-darkBg timeline-dot"></div>
                <div class="rounded-xl border border-white/8 p-5 bg-white/3 group-hover:border-secondary/30 transition-colors spotlight-card">
                  <div class="flex justify-between items-start gap-2 mb-2">
                    <span class="font-mono text-xs text-secondary">2021 — 2023</span>
                    <span class="px-2 py-0.5 rounded-md bg-secondary/10 text-[10px] text-secondary font-mono border border-secondary/20">60.61%</span>
                  </div>
                  <h3 class="font-jakarta font-bold text-gray-100">HSC — Science Stream</h3>
                  <p class="text-sm text-gray-500 mt-0.5">Sigma School, Porbandar</p>
                </div>
              </div>

              <div class="relative group">
                <div class="absolute -left-10 top-1 w-3 h-3 rounded-full border border-rose bg-darkBg timeline-dot"></div>
                <div class="rounded-xl border border-white/8 p-5 bg-white/3 group-hover:border-rose/30 transition-colors spotlight-card">
                  <div class="flex justify-between items-start gap-2 mb-2">
                    <span class="font-mono text-xs text-rose">2020 — 2021</span>
                    <span class="px-2 py-0.5 rounded-md bg-rose/10 text-[10px] text-rose font-mono border border-rose/20">79.81%</span>
                  </div>
                  <h3 class="font-jakarta font-bold text-gray-100">SSC — Secondary School</h3>
                  <p class="text-sm text-gray-500 mt-0.5">Sigma School, Porbandar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= SKILLS ================= -->
      <section id="skills" class="py-24 px-6 max-w-7xl mx-auto w-full scroll-reveal reveal-flip">
        <div class="text-center space-y-3 mb-14">
          <span class="font-mono text-xs text-primary uppercase tracking-widest">Capabilities</span>
          <h2 class="text-3xl sm:text-5xl font-jakarta font-extrabold">Technical Skills</h2>
          <!-- Premium Animated Separator -->
          <div class="flex items-center justify-center gap-1.5 mt-3 select-none pointer-events-none">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent rounded-full"></span>
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-transparent via-secondary to-primary rounded-full"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping" style="animation-delay: 0.5s;"></span>
          </div>
        </div>

        <!-- Languages -->
        <div class="mb-10">
          <h3 class="font-jakarta font-semibold text-gray-300 text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <span class="w-6 h-px bg-primary inline-block"></span>Languages
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <!-- Python -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-sky/40 hover:bg-sky/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="90">
              <div class="flex justify-between items-start">
                <i class="fa-brands fa-python text-3xl text-sky group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">90%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">Python</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-sky rounded-full transition-all duration-1000 w-0 group-hover:w-[90%]"></div>
                </div>
              </div>
            </div>
            <!-- Java -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-orange-400/40 hover:bg-orange-400/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="75">
              <div class="flex justify-between items-start">
                <i class="fa-brands fa-java text-3xl text-orange-400 group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">75%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">Java</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-orange-400 rounded-full transition-all duration-1000 w-0 group-hover:w-[75%]"></div>
                </div>
              </div>
            </div>
            <!-- C / C++ -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-gray-400/40 hover:bg-gray-400/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="70">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-c text-3xl text-gray-400 group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">70%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">C / C++</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gray-400 rounded-full transition-all duration-1000 w-0 group-hover:w-[70%]"></div>
                </div>
              </div>
            </div>
            <!-- SQL -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-accent/40 hover:bg-accent/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="80">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-database text-3xl text-accent group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">80%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">SQL</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-accent rounded-full transition-all duration-1000 w-0 group-hover:w-[80%]"></div>
                </div>
              </div>
            </div>
            <!-- JS -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-yellow-400/40 hover:bg-yellow-400/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="75">
              <div class="flex justify-between items-start">
                <i class="fa-brands fa-js text-3xl text-yellow-400 group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">75%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">JavaScript</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-yellow-400 rounded-full transition-all duration-1000 w-0 group-hover:w-[75%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI / ML Frameworks -->
        <div class="mb-10">
          <h3 class="font-jakarta font-semibold text-gray-300 text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <span class="w-6 h-px bg-secondary inline-block"></span>AI & ML Frameworks
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <!-- TensorFlow -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="85">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-fire text-3xl text-orange-400 group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">85%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">TensorFlow</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-orange-400 rounded-full transition-all duration-1000 w-0 group-hover:w-[85%]"></div>
                </div>
              </div>
            </div>
            <!-- PyTorch -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-rose/40 hover:bg-rose/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="90">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-fire-flame-curved text-3xl text-rose group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">90%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">PyTorch</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-rose rounded-full transition-all duration-1000 w-0 group-hover:w-[90%]"></div>
                </div>
              </div>
            </div>
            <!-- Scikit-learn -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-sky/40 hover:bg-sky/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="85">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-chart-bar text-3xl text-sky group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">85%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">Scikit-learn</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-sky rounded-full transition-all duration-1000 w-0 group-hover:w-[85%]"></div>
                </div>
              </div>
            </div>
            <!-- Pandas / NumPy -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-primary/40 hover:bg-primary/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="90">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-table text-3xl text-primary group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">90%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">Pandas & NumPy</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full transition-all duration-1000 w-0 group-hover:w-[90%]"></div>
                </div>
              </div>
            </div>
            <!-- Streamlit -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-teal/40 hover:bg-teal/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="85">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-layer-group text-3xl text-teal group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">85%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">Streamlit</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-teal rounded-full transition-all duration-1000 w-0 group-hover:w-[85%]"></div>
                </div>
              </div>
            </div>
            <!-- Matplotlib -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-accent/40 hover:bg-accent/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="80">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-chart-pie text-3xl text-accent group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">80%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">Matplotlib & Seaborn</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-accent rounded-full transition-all duration-1000 w-0 group-hover:w-[80%]"></div>
                </div>
              </div>
            </div>
            <!-- OpenCV -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-secondary/40 hover:bg-secondary/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="80">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-eye text-3xl text-secondary group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">80%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-bold text-sm text-gray-200">OpenCV</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-secondary rounded-full transition-all duration-1000 w-0 group-hover:w-[80%]"></div>
                </div>
              </div>
            </div>
            <!-- NLP -->
            <div class="skill-card rounded-xl border border-white/8 p-5 bg-white/3 hover:border-rose/40 hover:bg-rose/5 transition-all group spotlight-card flex flex-col justify-between h-32" data-skill-val="75">
              <div class="flex justify-between items-start">
                <i class="fa-solid fa-comments text-3xl text-rose group-hover:scale-110 transition-transform"></i>
                <span class="font-mono text-[10px] text-gray-500">75%</span>
              </div>
              <div class="space-y-2 mt-auto">
                <p class="font-jakarta font-semibold text-sm text-gray-200">NLP / NLTK</p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-rose rounded-full transition-all duration-1000 w-0 group-hover:w-[75%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tools -->
        <div>
          <h3 class="font-jakarta font-semibold text-gray-300 text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <span class="w-6 h-px bg-teal inline-block"></span>Tools & Platforms
          </h3>
          <div class="flex flex-wrap gap-3">
            <span class="px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-xs font-mono text-gray-300 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1.5"><i class="fa-brands fa-github"></i> Git / GitHub</span>
            <span class="px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-xs font-mono text-gray-300 hover:border-sky/40 hover:text-sky transition-all flex items-center gap-1.5"><i class="fa-brands fa-docker"></i> Docker</span>
            <span class="px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-xs font-mono text-gray-300 hover:border-accent/40 hover:text-accent transition-all flex items-center gap-1.5"><i class="fa-solid fa-chart-column"></i> Power BI</span>
            <span class="px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-xs font-mono text-gray-300 hover:border-secondary/40 hover:text-secondary transition-all flex items-center gap-1.5"><i class="fa-solid fa-terminal"></i> Linux CLI</span>
            <span class="px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-xs font-mono text-gray-300 hover:border-rose/40 hover:text-rose transition-all flex items-center gap-1.5"><i class="fa-solid fa-code"></i> VS Code</span>
            <span class="px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-xs font-mono text-gray-300 hover:border-accent/40 hover:text-accent transition-all flex items-center gap-1.5"><i class="fa-brands fa-python"></i> Jupyter Notebook</span>
            <span class="px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-xs font-mono text-gray-300 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1.5"><i class="fa-solid fa-server"></i> Vercel / Netlify</span>
          </div>
        </div>
      </section>

      <!-- ================= PROJECTS ================= -->
      <section id="projects" class="py-24 px-6 max-w-7xl mx-auto w-full scroll-reveal reveal-zoom-fade">
        <div class="text-center space-y-3 mb-14">
          <span class="font-mono text-xs text-primary uppercase tracking-widest">Work</span>
          <h2 class="text-3xl sm:text-5xl font-jakarta font-extrabold">Projects</h2>
          <!-- Premium Animated Separator -->
          <div class="flex items-center justify-center gap-1.5 mt-3 select-none pointer-events-none">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent rounded-full"></span>
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-transparent via-secondary to-primary rounded-full"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping" style="animation-delay: 0.5s;"></span>
          </div>
          <p class="font-inter text-sm text-gray-500">Select a category to view repositories fetched live from <a href="https://github.com/Raj-Rathod-Ai" target="_blank" class="text-primary hover:underline">GitHub</a></p>
        </div>

        <!-- Dynamic Category Selection Grid -->
        <div id="home-categories-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Rendered dynamically -->
        </div>
      </section>

      <!-- ================= GITHUB STATS ================= -->
      <section id="github" class="py-24 px-6 max-w-7xl mx-auto w-full scroll-reveal reveal-zoom-fade">
        <div class="text-center space-y-3 mb-14">
          <span class="font-mono text-xs text-teal uppercase tracking-widest">GitHub</span>
          <h2 class="text-3xl sm:text-5xl font-jakarta font-extrabold">Activity Dashboard</h2>
          <!-- Premium Animated Separator -->
          <div class="flex items-center justify-center gap-1.5 mt-3 select-none pointer-events-none">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent rounded-full"></span>
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-transparent via-secondary to-primary rounded-full"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping" style="animation-delay: 0.5s;"></span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Stats Cards -->
          <div class="lg:col-span-5 flex flex-col gap-4">
            <div class="rounded-xl border border-white/8 p-6 bg-white/3 flex items-center justify-between spotlight-card">
              <div>
                <span class="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Public Repositories</span>
                <span id="git-repos-count" class="block font-jakarta font-extrabold text-3xl text-primary">--</span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <i class="fa-solid fa-code-fork text-primary text-lg"></i>
              </div>
            </div>
            <div class="rounded-xl border border-white/8 p-6 bg-white/3 flex items-center justify-between spotlight-card">
              <div>
                <span class="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">GitHub Followers</span>
                <span id="git-followers-count" class="block font-jakarta font-extrabold text-3xl text-secondary">--</span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <i class="fa-solid fa-users text-secondary text-lg"></i>
              </div>
            </div>
            <div class="rounded-xl border border-white/8 p-6 bg-white/3 flex items-center justify-between spotlight-card">
              <div>
                <span class="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Total Stars</span>
                <span id="git-stars-count" class="block font-jakarta font-extrabold text-3xl text-accent">--</span>
              </div>
              <div class="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <i class="fa-solid fa-star text-accent text-lg"></i>
              </div>
            </div>
          </div>

          <!-- Language Chart -->
          <div class="lg:col-span-7 rounded-xl border border-white/8 p-6 bg-white/3 flex flex-col justify-between min-h-[300px] spotlight-card">
            <div class="flex justify-between items-center mb-4">
              <span class="font-jakarta font-semibold text-gray-200"><i class="fa-brands fa-github mr-2 text-gray-400"></i>Language Distribution</span>
              <span class="font-mono text-[10px] text-teal bg-teal/10 border border-teal/20 px-2 py-0.5 rounded-md">Live Data</span>
            </div>
            <div class="flex-1 flex items-center justify-center p-2 relative">
              <div class="w-full max-w-[280px]">
                <canvas id="git-lang-chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= CERTIFICATIONS SECTION ================= -->
      <section id="certifications" class="py-24 px-6 max-w-7xl mx-auto w-full scroll-reveal reveal-rotate-pop">
        <div class="text-center space-y-3 mb-14">
          <span class="font-mono text-xs text-accent uppercase tracking-widest">Credentials</span>
          <h2 class="text-3xl sm:text-4xl font-jakarta font-extrabold text-gray-100">Certifications</h2>
          <!-- Premium Animated Separator -->
          <div class="flex items-center justify-center gap-1.5 mt-3 select-none pointer-events-none">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent rounded-full"></span>
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-transparent via-secondary to-primary rounded-full"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping" style="animation-delay: 0.5s;"></span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <a href="https://github.com/Raj-Rathod-Ai/CERTIFICATE/blob/main/java%20i.jpeg" target="_blank" rel="noopener" class="rounded-xl border border-white/8 p-5 bg-white/3 hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44 spotlight-card">
            <div class="space-y-3">
              <div class="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <i class="fa-brands fa-java text-base"></i>
              </div>
              <div>
                <h3 class="font-jakarta font-bold text-sm text-gray-100 group-hover:text-primary transition-colors">Java Programming</h3>
                <p class="text-xs text-gray-500 mt-1">Core Structures & Algorithms certification.</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-mono text-gray-600 group-hover:text-gray-300 transition-colors">
              <span>View Credential</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </div>
          </a>

          <a href="https://github.com/Raj-Rathod-Ai/CERTIFICATE/blob/main/prompt.jpeg" target="_blank" rel="noopener" class="rounded-xl border border-white/8 p-5 bg-white/3 hover:border-secondary/40 hover:bg-secondary/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44 spotlight-card">
            <div class="space-y-3">
              <div class="w-9 h-9 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-brain text-base"></i>
              </div>
              <div>
                <h3 class="font-jakarta font-bold text-sm text-gray-100 group-hover:text-secondary transition-colors">Prompt Engineering</h3>
                <p class="text-xs text-gray-500 mt-1">Advanced model tuning and LLM query building.</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-mono text-gray-600 group-hover:text-gray-300 transition-colors">
              <span>View Credential</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </div>
          </a>

          <a href="https://github.com/Raj-Rathod-Ai/CERTIFICATE/blob/main/python.jpeg" target="_blank" rel="noopener" class="rounded-xl border border-white/8 p-5 bg-white/3 hover:border-teal/40 hover:bg-teal/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44 spotlight-card">
            <div class="space-y-3">
              <div class="w-9 h-9 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center text-teal group-hover:scale-110 transition-transform">
                <i class="fa-brands fa-python text-base"></i>
              </div>
              <div>
                <h3 class="font-jakarta font-bold text-sm text-gray-100 group-hover:text-teal transition-colors">Python Programming</h3>
                <p class="text-xs text-gray-500 mt-1">Data analysis and algorithmic structures.</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-mono text-gray-600 group-hover:text-gray-300 transition-colors">
              <span>View Credential</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </div>
          </a>

          <a href="https://github.com/Raj-Rathod-Ai/CERTIFICATE/blob/main/Computer%20Networks%20And%20Internet%20Protocol-1.pdf" target="_blank" rel="noopener" class="rounded-xl border border-white/8 p-5 bg-white/3 hover:border-rose/40 hover:bg-rose/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44 spotlight-card">
            <div class="space-y-3">
              <div class="w-9 h-9 rounded-lg bg-rose/10 border border-rose/20 flex items-center justify-center text-rose group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-network-wired text-base"></i>
              </div>
              <div>
                <h3 class="font-jakarta font-bold text-sm text-gray-100 group-hover:text-rose transition-colors">Networks & Protocols</h3>
                <p class="text-xs text-gray-500 mt-1">NPTEL IIT computer networks engineering.</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-mono text-gray-600 group-hover:text-gray-300 transition-colors">
              <span>View PDF Credential</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </div>
          </a>
        </div>
      </section>

      <!-- ================= REVIEWS ================= -->
      <section id="reviews" class="py-24 px-6 max-w-7xl mx-auto w-full scroll-reveal reveal-zoom-fade">
        <div class="text-center space-y-3 mb-14">
          <span class="font-mono text-xs text-rose uppercase tracking-widest">Testimonials</span>
          <h2 class="text-3xl sm:text-5xl font-jakarta font-extrabold">Reviews</h2>
          <!-- Premium Animated Separator -->
          <div class="flex items-center justify-center gap-1.5 mt-3 select-none pointer-events-none">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent rounded-full"></span>
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-transparent via-secondary to-primary rounded-full"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping" style="animation-delay: 0.5s;"></span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Submit Review Form -->
          <div class="lg:col-span-5 rounded-xl border border-white/8 p-6 bg-white/3 space-y-5 spotlight-card">
            <h3 class="font-jakarta font-bold text-lg text-gray-100">Leave a Review</h3>
            <form id="review-form" class="space-y-4">
              <div class="space-y-1">
                <label for="rev-name" class="block font-mono text-[10px] text-gray-500 uppercase">Your Name</label>
                <input type="text" id="rev-name" name="name" required placeholder="Name" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-gray-100 transition-colors placeholder-gray-600">
              </div>

              <div class="space-y-1">
                <label class="block font-mono text-[10px] text-gray-500 uppercase">Rating</label>
                <div class="flex space-x-2 text-xl" id="review-stars-selector">
                  <i class="fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors" data-val="1"></i>
                  <i class="fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors" data-val="2"></i>
                  <i class="fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors" data-val="3"></i>
                  <i class="fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors" data-val="4"></i>
                  <i class="fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors" data-val="5"></i>
                </div>
                <input type="hidden" id="rev-rating" name="rating" value="5">
              </div>

              <div class="space-y-1">
                <label for="rev-comment" class="block font-mono text-[10px] text-gray-500 uppercase">Message</label>
                <textarea id="rev-comment" name="review" rows="4" required placeholder="Share your experience..." class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-gray-100 transition-colors placeholder-gray-600"></textarea>
              </div>

              <button type="submit" id="review-btn" class="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-sm font-jakarta font-semibold text-white hover:opacity-90 active:scale-95 transition-all">
                Submit Review
              </button>
            </form>
          </div>

          <!-- Reviews List -->
          <div class="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-2" id="reviews-list-container">
            <!-- Dynamically populated -->
          </div>
        </div>
      </section>

      <!-- ================= CONTACT ================= -->
      <section id="contact" class="py-24 px-6 max-w-7xl mx-auto w-full scroll-reveal reveal-zoom-fade">
        <div class="text-center space-y-3 mb-14">
          <span class="font-mono text-xs text-teal uppercase tracking-widest">Contact</span>
          <h2 class="text-3xl sm:text-5xl font-jakarta font-extrabold">Get in Touch</h2>
          <!-- Premium Animated Separator -->
          <div class="flex items-center justify-center gap-1.5 mt-3 select-none pointer-events-none">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent rounded-full"></span>
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            <span class="w-12 h-[2px] bg-gradient-to-r from-transparent via-secondary to-primary rounded-full"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping" style="animation-delay: 0.5s;"></span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <!-- Contact Info -->
          <div class="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h3 class="font-jakarta font-bold text-xl text-gray-100">Let's Connect</h3>
              <p class="font-inter text-sm text-gray-400 mt-2 leading-relaxed">Open for collaborations, internships, and project discussions. Reach me through any of these channels:</p>
            </div>

            <div class="space-y-3">
              <a href="mailto:rathodraj1504@gmail.com" class="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/3 hover:border-primary/40 hover:bg-primary/5 transition-all group spotlight-card">
                <div class="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-envelope text-primary"></i>
                </div>
                <div>
                  <span class="block font-mono text-[10px] text-gray-600 uppercase">Email</span>
                  <span class="block font-inter text-sm text-gray-200 group-hover:text-primary transition-colors">rathodraj1504@gmail.com</span>
                </div>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs text-gray-600 ml-auto group-hover:text-primary transition-colors"></i>
              </a>

              <a href="tel:+919624801014" class="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/3 hover:border-teal/40 hover:bg-teal/5 transition-all group spotlight-card">
                <div class="w-10 h-10 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-phone text-teal"></i>
                </div>
                <div>
                  <span class="block font-mono text-[10px] text-gray-600 uppercase">Phone</span>
                  <span class="block font-inter text-sm text-gray-200 group-hover:text-teal transition-colors">+91 96248 01014</span>
                </div>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs text-gray-600 ml-auto group-hover:text-teal transition-colors"></i>
              </a>

              <a href="https://maps.google.com/?q=Amardad,Ranavav,Porbandar,360560" target="_blank" rel="noopener" class="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/3 hover:border-rose/40 hover:bg-rose/5 transition-all group spotlight-card">
                <div class="w-10 h-10 rounded-lg bg-rose/10 border border-rose/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-location-dot text-rose"></i>
                </div>
                <div>
                  <span class="block font-mono text-[10px] text-gray-600 uppercase">Location</span>
                  <span class="block font-inter text-sm text-gray-200 group-hover:text-rose transition-colors">Amardad, Ranavav, Porbandar - 360560, Gujarat, India</span>
                </div>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs text-gray-600 ml-auto group-hover:text-rose transition-colors"></i>
              </a>
            </div>

            <!-- Social Links follow me dashboard widgets -->
            <div class="space-y-2">
              <span class="font-mono text-[10px] text-gray-600 uppercase">Follow Me</span>
              <div class="grid grid-cols-2 gap-3">
                <a href="https://github.com/Raj-Rathod-Ai" target="_blank" rel="noopener" class="flex items-center gap-2 p-3 rounded-xl border border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5 transition-all group spotlight-card">
                  <i class="fa-brands fa-github text-gray-400 group-hover:text-white text-lg"></i>
                  <span class="font-inter text-xs text-gray-400 group-hover:text-white transition-colors">GitHub</span>
                </a>
                <a href="https://linkedin.com/in/raj-rathod-ai" target="_blank" rel="noopener" class="flex items-center gap-2 p-3 rounded-xl border border-white/8 bg-white/3 hover:border-sky/40 hover:bg-sky/5 transition-all group spotlight-card">
                  <i class="fa-brands fa-linkedin text-gray-400 group-hover:text-sky text-lg"></i>
                  <span class="font-inter text-xs text-gray-400 group-hover:text-sky transition-colors">LinkedIn</span>
                </a>
                <a href="https://instagram.com/its._.rudra._.19.08_" target="_blank" rel="noopener" class="flex items-center gap-2 p-3 rounded-xl border border-white/8 bg-white/3 hover:border-rose/40 hover:bg-rose/5 transition-all group spotlight-card">
                  <i class="fa-brands fa-instagram text-gray-400 group-hover:text-rose text-lg"></i>
                  <span class="font-inter text-xs text-gray-400 group-hover:text-rose transition-colors">Instagram</span>
                </a>
                <a href="https://leetcode.com/u/Rathod-Raj-Ai/" target="_blank" rel="noopener" class="flex items-center gap-2 p-3 rounded-xl border border-white/8 bg-white/3 hover:border-accent/40 hover:bg-accent/5 transition-all group spotlight-card">
                  <i class="fa-solid fa-code text-gray-400 group-hover:text-accent text-lg"></i>
                  <span class="font-inter text-xs text-gray-400 group-hover:text-accent transition-colors">LeetCode</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-7 rounded-xl border border-white/8 p-6 bg-white/3 spotlight-card">
            <form id="contact-form" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="msg-name" class="block font-mono text-[10px] text-gray-500 uppercase">Name</label>
                  <input type="text" id="msg-name" name="name" required placeholder="Your name" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-gray-100 transition-colors placeholder-gray-600">
                </div>
                <div class="space-y-1">
                  <label for="msg-email" class="block font-mono text-[10px] text-gray-500 uppercase">Email</label>
                  <input type="email" id="msg-email" name="email" required placeholder="your@email.com" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-gray-100 transition-colors placeholder-gray-600">
                </div>
              </div>

              <div class="space-y-1">
                <label for="msg-subj" class="block font-mono text-[10px] text-gray-500 uppercase">Subject</label>
                <input type="text" id="msg-subj" name="_subject_custom" required placeholder="Project / Collaboration / Internship" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-gray-100 transition-colors placeholder-gray-600">
              </div>

              <div class="space-y-1">
                <label for="msg-content" class="block font-mono text-[10px] text-gray-500 uppercase">Message</label>
                <textarea id="msg-content" name="message" rows="5" required placeholder="Tell me about your project or opportunity..." class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary text-gray-100 transition-colors placeholder-gray-600"></textarea>
              </div>

              <button type="submit" id="contact-btn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-sm font-jakarta font-semibold text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                <i class="fa-solid fa-paper-plane"></i> Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Transmission Success/Error Modal -->
      <div id="transmission-modal" class="fixed inset-0 z-[1000] hidden items-center justify-center p-6 bg-black/70 backdrop-blur-lg">
        <div class="max-w-md w-full rounded-2xl border border-white/10 p-8 text-center space-y-5" style="background: rgba(22,27,34,0.95)">
          <div id="transmission-icon-container" class="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl border"></div>
          <div class="space-y-2">
            <h3 id="transmission-title" class="font-jakarta font-extrabold text-xl text-gray-100"></h3>
            <p id="transmission-desc" class="font-inter text-sm text-gray-400 leading-relaxed"></p>
          </div>
          <button id="transmission-close-btn" class="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/30 transition-all text-xs font-mono text-gray-400 hover:text-white">
            Close
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Bind event listeners, start animations, fetch statistics, and run sub-components.
   */
  async setup(projects, localMetadata) {
    // 1. Setup Hero Sub-Component
    this.hero.setup();

    // 2. Render and Setup Category Tiles
    const categoriesGrid = document.getElementById('home-categories-grid');
    if (categoriesGrid) {
      const categories = getAllCategories(projects);
      categoriesGrid.innerHTML = categories.map(cat => this.categoryCard.render(cat)).join('');
      this.categoryCard.setup(categoriesGrid);
    }

    // 3. GitHub Dashboard Counters & Chart
    let gitChart = null;
    const updateGitChart = (labels, dataValues) => {
      const gitChartCanvas = document.getElementById('git-lang-chart');
      if (!gitChartCanvas || typeof Chart === 'undefined') return;
      if (gitChart) gitChart.destroy();

      const PALETTE = ['#6366f1','#8b5cf6','#f59e0b','#14b8a6','#f43f5e','#38bdf8','#a78bfa','#fb923c'];
      gitChart = new Chart(gitChartCanvas, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: dataValues,
            backgroundColor: PALETTE.slice(0, labels.length),
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#9ca3af',
                font: { family: 'JetBrains Mono', size: 11 },
                padding: 12,
                boxWidth: 10,
                boxHeight: 10,
                borderRadius: 4
              }
            }
          },
          cutout: '65%',
          animation: { animateRotate: true, duration: 800 }
        }
      });
    };

    const fetchGitHubData = async () => {
      const reposCountEl = document.getElementById('git-repos-count');
      const followersCountEl = document.getElementById('git-followers-count');
      const starsCountEl = document.getElementById('git-stars-count');

      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/Raj-Rathod-Ai'),
          fetch('https://api.github.com/users/Raj-Rathod-Ai/repos?per_page=100')
        ]);

        const user = await userRes.json();
        const repos = await reposRes.json();

        if (reposCountEl) reposCountEl.textContent = user.public_repos ?? repos.length;
        if (followersCountEl) followersCountEl.textContent = user.followers ?? 0;

        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        if (starsCountEl) starsCountEl.textContent = totalStars;

        const langMap = {};
        repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
        const sorted = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 7);
        if (sorted.length > 0) {
          updateGitChart(sorted.map(s => s[0]), sorted.map(s => s[1]));
        } else {
          updateGitChart(['Python', 'Java', 'C/C++', 'HTML/CSS', 'SQL'], [45, 20, 15, 12, 8]);
        }
      } catch (err) {
        console.warn('GitHub stats load failed. Using fallbacks.', err);
        if (reposCountEl) reposCountEl.textContent = '28';
        if (followersCountEl) followersCountEl.textContent = '7';
        if (starsCountEl) starsCountEl.textContent = '20';
        updateGitChart(['Python', 'Java', 'C/C++', 'HTML/CSS', 'SQL'], [45, 20, 15, 12, 8]);
      }
    };

    fetchGitHubData();

    // 4. Modal Handlers
    const modal = document.getElementById('transmission-modal');
    const modalCloseBtn = document.getElementById('transmission-close-btn');

    const showModal = (type, title, desc) => {
      const iconContainer = document.getElementById('transmission-icon-container');
      const titleEl = document.getElementById('transmission-title');
      const descEl = document.getElementById('transmission-desc');
      if (!modal) return;

      const isSuccess = type === 'success';
      if (iconContainer) {
        iconContainer.className = `w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl border ${isSuccess ? 'bg-teal/10 border-teal/30 text-teal' : 'bg-rose/10 border-rose/30 text-rose'}`;
        iconContainer.innerHTML = `<i class="fa-solid ${isSuccess ? 'fa-check' : 'fa-triangle-exclamation'}"></i>`;
      }
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    };

    const closeModal = () => {
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    };

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    // 5. Star Rating System
    let selectedRating = 5;
    const starContainer = document.getElementById('review-stars-selector');
    const ratingInput = document.getElementById('rev-rating');

    if (starContainer) {
      const stars = starContainer.querySelectorAll('i');
      stars.forEach(star => {
        star.addEventListener('click', () => {
          selectedRating = parseInt(star.dataset.val);
          if (ratingInput) ratingInput.value = selectedRating;
          stars.forEach((s, i) => {
            s.className = i < selectedRating 
              ? 'fa-solid fa-star text-accent cursor-pointer' 
              : 'fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors';
          });
        });
        star.addEventListener('mouseenter', () => {
          const val = parseInt(star.dataset.val);
          stars.forEach((s, i) => {
            s.className = i < val 
              ? 'fa-solid fa-star text-accent cursor-pointer' 
              : 'fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors';
          });
        });
        star.addEventListener('mouseleave', () => {
          stars.forEach((s, i) => {
            s.className = i < selectedRating 
              ? 'fa-solid fa-star text-accent cursor-pointer' 
              : 'fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors';
          });
        });
      });
    }

    // API Base URL config (switch relative for local, absolute for Render in production)
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '' : 'https://portfolio-raj-qda3.onrender.com';

    // 6. Review list renderer
    const renderReviewsList = async () => {
      const container = document.getElementById('reviews-list-container');
      if (!container) return;

      let reviews = [];
      try {
        const res = await fetch(API_BASE_URL + '/api/reviews');
        if (!res.ok) throw new Error('API failed');
        reviews = await res.json();
      } catch (err) {
        console.warn('Backend reviews request failed, falling back to localStorage.', err);
        reviews = JSON.parse(localStorage.getItem('portfolioReviews') || '[]');
        if (reviews.length === 0) {
          reviews = [
            {
              name: 'Prof. K. R. Patel',
              rating: 5,
              review: 'Raj is a highly competent machine learning developer. His work on predictive models shows clean styling, sound architecture, and solid execution. Excellent engineering mindset!',
              date: '12 Jun 2026'
            },
            {
              name: 'Mayur (Cyber Security Teammate)',
              rating: 5,
              review: 'Worked with Raj on computer vision applications. His speed in debugging model deployments and building pipeline interfaces is exceptional. Great teammate!',
              date: '02 May 2026'
            }
          ];
          localStorage.setItem('portfolioReviews', JSON.stringify(reviews));
        }
      }

      container.innerHTML = reviews.map(r => `
        <div class="rounded-xl border border-white/8 p-5 bg-white/3 space-y-3">
          <div class="flex justify-between items-start gap-2">
            <div>
              <span class="font-jakarta font-semibold text-sm text-gray-100">${r.name}</span>
              <span class="block font-mono text-[10px] text-gray-600 mt-0.5">${r.date}</span>
            </div>
            <div class="flex gap-0.5 flex-shrink-0">${'<i class="fa-solid fa-star text-accent text-xs"></i>'.repeat(r.rating)}</div>
          </div>
          <p class="font-inter text-xs text-gray-400 leading-relaxed">${r.review}</p>
        </div>
      `).join('');
    };

    renderReviewsList();

    // 7. Review Form Submit
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('review-btn');
        if (btn) { btn.textContent = 'Submitting...'; btn.disabled = true; }

        const nameVal = document.getElementById('rev-name')?.value.trim();
        const reviewVal = document.getElementById('rev-comment')?.value.trim();
        const ratingVal = parseInt(document.getElementById('rev-rating')?.value || '5');

        const bodyData = { name: nameVal, review: reviewVal, rating: ratingVal };

        try {
          const res = await fetch(API_BASE_URL + '/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
          });
          if (!res.ok) throw new Error('API POST failed');
          
          const reviews = JSON.parse(localStorage.getItem('portfolioReviews') || '[]');
          const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          reviews.unshift({ name: nameVal, rating: ratingVal, review: reviewVal, date: formattedDate });
          localStorage.setItem('portfolioReviews', JSON.stringify(reviews));
          
          showModal('success', 'Review Posted!', 'Thanks for your feedback!');
          if (typeof confetti !== 'undefined') confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        } catch (err) {
          console.error('Submit review error:', err);
          showModal('error', 'Failed to Post', 'Please try again later.');
        }

        await renderReviewsList();
        reviewForm.reset();
        selectedRating = 5;
        if (ratingInput) ratingInput.value = 5;
        if (starContainer) {
          starContainer.querySelectorAll('i').forEach((s, i) => {
            s.className = i < 5 ? 'fa-solid fa-star text-accent cursor-pointer' : 'fa-regular fa-star text-gray-600 cursor-pointer hover:text-accent transition-colors';
          });
        }
        if (btn) { btn.textContent = 'Submit Review'; btn.disabled = false; }
      });
    }

    // 8. Contact Form Submit
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('contact-btn');
        if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Sending...'; btn.disabled = true; }

        const nameVal = document.getElementById('msg-name')?.value.trim();
        const emailVal = document.getElementById('msg-email')?.value.trim();
        const subjectVal = document.getElementById('msg-subj')?.value.trim();
        const messageVal = document.getElementById('msg-content')?.value.trim();

        const tempContact = { name: nameVal, email: emailVal, subject: subjectVal, message: messageVal, timestamp: Date.now() };
        localStorage.setItem('tempContactMessage', JSON.stringify(tempContact));

        try {
          const res = await fetch(API_BASE_URL + '/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nameVal, email: emailVal, subject: subjectVal, message: messageVal })
          });
          
          if (!res.ok) throw new Error('Backend contact submission failed');
          
          showModal('success', 'Message Sent!', 'Thank you! I will get back to you soon.');
          contactForm.reset();
          localStorage.removeItem('tempContactMessage');
        } catch (err) {
          console.error('Contact submission error:', err);
          showModal('error', 'Failed to Send', 'Could not establish connection to the mail server. Please try emailing directly at rathodraj1504@gmail.com');
        }

        if (btn) { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message'; btn.disabled = false; }
      });
    }

    // 9. Re-trigger observer registrations for scroll-reveals
    if (window.initializeObservers) {
      window.initializeObservers();
    }
  }
}
