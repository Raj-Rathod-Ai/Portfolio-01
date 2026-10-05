import { Hero } from '../components/Hero.js';
import { TechOrbit } from '../components/TechOrbit.js';
import { containsAbusiveContent } from '../utils/profanityFilter.js';
import { setVisitorName, getVisitorId, validateVisitorName, isBossDevice, getMasterPassword, getApiBaseUrl } from '../utils/analytics.js';

/**
 * Home Page - Interactive 3D portfolio architecture for Raj Rathod.
 * Sections in order:
 * 1. HeroSection (LiquidEther WebGL fluid, 3D turnaround character with collar intact, Svg_Stroke layers, RAJ monumental heading)
 * 2. LogoMarquee (Continuous ticker strip)
 * 3. About (Exact 12-col Bento Grid with 3D portrait, stats, philosophy, currently focused on, latest ship)
 * 4. TechOrbit (3D tilted SolarSystem orbit with revolving planets)
 * 5. Projects (Stacked sticky cards with alternating light/accent themes, stats badges, tech tags, slide label)
 * 6. Testimonials (Infinite community reviews marquee)
 * 7. Gallery (Bento media grid with playable videos & photos + show more toggle)
 * 8. Contact (Glowing ct-box with 4 corner dots, 'let's talk.', email & WhatsApp)
 */
export class Home {
  constructor() {
    this.hero = new Hero();
    this.techOrbit = new TechOrbit();
  }

  render() {
    const marqueeItems = [
      '🚀 WELCOME TO MY PORTFOLIO',
      '🤖 ARTIFICIAL INTELLIGENCE & MACHINE LEARNING',
      '⚡ DEEP LEARNING & COMPUTER VISION',
      '🧠 NLP & RAG ARCHITECTURES',
      '🚀 WELCOME TO MY PORTFOLIO',
      '🤖 ARTIFICIAL INTELLIGENCE & MACHINE LEARNING',
      '⚡ DEEP LEARNING & COMPUTER VISION',
      '🧠 NLP & RAG ARCHITECTURES'
    ];

    const projectsList = [
      {
        title: "SENTI.AI",
        subtitle: "BiGRU Emotion Detection System",
        description: "Deep learning NLP architecture utilizing bidirectional gated recurrent units (BiGRU) to analyze complex textual emotion nuances across 6 classes with 99.8% precision.",
        image: "/assets/projects/senti-ai.png",
        liveUrl: "https://senti-ai.onrender.com",
        githubUrl: "https://github.com/Raj-Rathod-Ai/SENTI-AI-BiGRU-Emotion-Detection-Using-DL",
        stats: [
          { icon: "fa-solid fa-brain", value: "BiGRU", label: "Deep Learning" },
          { icon: "fa-solid fa-bolt", value: "Live", label: "On Render" },
          { icon: "fa-solid fa-chart-line", value: "99.8%", label: "Accuracy" }
        ],
        stack: ["Python", "TensorFlow", "BiGRU", "NLP", "Render"],
        tone: "light"
      },
      {
        title: "FruitsCheck AI",
        subtitle: "CNN Real-Time Freshness Detection",
        description: "Computer vision classification system trained on multi-class fruit datasets to grade rot severity, defect localization, and real-time freshness detection.",
        image: "/assets/marquee/banner_computer_vision.jpg",
        liveUrl: "https://fruits-check.streamlit.app/",
        githubUrl: "https://github.com/Raj-Rathod-Ai/FruitsCheck-CNN-Fruit-Freshness",
        stats: [
          { icon: "fa-solid fa-eye", value: "CNN Vision", label: "Architecture" },
          { icon: "fa-solid fa-rocket", value: "Live", label: "On Streamlit" },
          { icon: "fa-solid fa-shield-halved", value: "98.4%", label: "Freshness Acc" }
        ],
        stack: ["Python", "PyTorch", "OpenCV", "Streamlit"],
        tone: "accent"
      },
      {
        title: "MeetNotes AI",
        subtitle: "Meeting Transcriber & RAG Summarizer",
        description: "Intelligent meeting audio transcription and retrieval-augmented generation engine extracting action items, semantic queries, and key decisions.",
        image: "/assets/projects/meetnotes.png",
        liveUrl: "https://meetnotes.streamlit.app/",
        githubUrl: "https://github.com/Raj-Rathod-Ai/MeetNotes",
        stats: [
          { icon: "fa-solid fa-link", value: "RAG & LLM", label: "LangChain" },
          { icon: "fa-solid fa-bolt", value: "Live", label: "On Streamlit" },
          { icon: "fa-solid fa-database", value: "ChromaDB", label: "Vector Index" }
        ],
        stack: ["LangChain", "ChromaDB", "Whisper", "Streamlit"],
        tone: "light"
      },
      {
        title: "Sukoon-Saathi",
        subtitle: "Empathetic Mental Health Companion",
        description: "Conversational psychological wellness assistant built with empathetic prompt pipelines and supportive cognitive sentiment response framing.",
        image: "/assets/projects/sukoon-saathi.png",
        liveUrl: "https://sukoonsaathi-frontend.onrender.com/",
        githubUrl: "https://github.com/Raj-Rathod-Ai/Sukoon-Saathi",
        stats: [
          { icon: "fa-solid fa-heart-pulse", value: "NLP", label: "Sentiment AI" },
          { icon: "fa-solid fa-rocket", value: "Live", label: "On Render" },
          { icon: "fa-solid fa-users", value: "Full-Stack", label: "FastAPI + React" }
        ],
        stack: ["FastAPI", "React", "Transformers", "Render"],
        tone: "accent"
      },
      {
        title: "TruthLens AI",
        subtitle: "Deepfake & Fake News Verification",
        description: "Multimodal news credibility verification platform analyzing linguistic markers, source trust matrices, and deepfake verification confidence scores.",
        image: "/assets/marquee/banner_deep_learning.jpg",
        liveUrl: "https://truthlens5.netlify.app/",
        githubUrl: "https://github.com/Raj-Rathod-Ai/TruthLens",
        stats: [
          { icon: "fa-solid fa-magnifying-glass-chart", value: "BiLSTM", label: "NLP Engine" },
          { icon: "fa-solid fa-bolt", value: "Live", label: "On Netlify" },
          { icon: "fa-solid fa-shield-check", value: "99.1%", label: "Confidence" }
        ],
        stack: ["Python", "BiLSTM", "Scikit-Learn", "FastAPI"],
        tone: "light"
      }
    ];

    const testimonials = [
      {
        name: "Prof. K. R. Patel",
        role: "Department of Computer Science & Engineering",
        rating: 5.0,
        text: "Raj is a remarkably disciplined and driven machine learning engineer. His work on neural architectures and computer vision demonstrates an exceptional engineering foundation and deep curiosity."
      },
      {
        name: "Mayur Sharma",
        role: "Cyber Security & Systems Teammate",
        rating: 4.9,
        text: "Collaborating with Raj on AI model deployments was brilliant. He moves fast, writes clean modular code, and has a strong problem-solving mindset under pressure."
      },
      {
        name: "Sandeep Linge",
        role: "Technical Mentor",
        rating: 4.8,
        text: "Raj actively pushes the boundaries of applied machine learning. He turns abstract research into deployable, functional applications with sound data pipelines."
      },
      {
        name: "Sheryians AI Mentor",
        role: "Applied AI Practitioner",
        rating: 5.0,
        text: "Raj possesses an insatiable drive to learn and master deep learning architectures. His projects stand out for their real-world impact and high model precision."
      },
      {
        name: "Srushti Kadam",
        role: "Hackathon Teammate",
        rating: 4.9,
        text: "Working alongside Raj on intelligent apps was effortless. He communicates clearly, takes ownership of the AI backend, and delivers results ahead of schedule."
      }
    ];

    return `
      <!-- ================= 1. HERO SECTION ================= -->
      <h1 class="sr-only">Raj Rathod — AI & Machine Learning Engineer Portfolio</h1>
      <div id="hero-mount">
        ${this.hero.render()}
      </div>

      <!-- ================= 2. LOGO MARQUEE ================= -->
      <section class="overflow-hidden py-4 w-full select-none bg-bg border-b border-theme-border">
        <div class="w-full">
          <div class="marquee-container relative overflow-hidden">
            <div class="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-bg to-transparent z-10"></div>
            <div class="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-bg to-transparent z-10"></div>
            <div class="marquee-track flex w-max will-change-transform" style="animation: marquee-scroll 40s linear infinite;">
              ${[...marqueeItems, ...marqueeItems].map(item => `
                <div class="flex shrink-0 items-center justify-center px-8 opacity-60 transition-opacity duration-200 hover:opacity-100">
                  <span class="whitespace-nowrap font-semibold text-fg text-lg sm:text-xl tracking-tight font-display">${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- ================= 3. ABOUT SECTION (BENTO GRID) ================= -->
      <section id="about" class="w-full px-5 md:px-8 py-20 md:py-32 max-w-6xl mx-auto select-none">
        
        <!-- Badge + Heading -->
        <div class="flex justify-center md:justify-start">
          <div class="inline-flex items-center gap-2 rounded-full border border-theme-border bg-bg-alt px-3.5 py-1 font-cond text-xs text-fg-muted font-medium">
            <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"></span>
            About Me
          </div>
        </div>

        <h2 class="mt-6 max-w-4xl text-center md:text-left font-hero font-bold leading-[1.05] tracking-tight text-fg"
            style="font-size: clamp(2rem, 6vw, 4.25rem);">
          I build AI systems that solve <span class="about-real-problems">real problems</span>
        </h2>

        <p class="mt-6 max-w-xl text-center md:text-left text-base md:text-lg leading-relaxed text-fg-muted font-cond">
          I'm Raj, an AI &amp; Machine Learning engineer from India. I turn complex neural architectures into clean, production-grade solutions — from real-time computer vision to conversational RAG platforms.
        </p>

        <!-- Stats Divider -->
        <div class="mt-10 flex flex-wrap justify-center md:justify-start divide-x divide-theme-border border-t border-theme-border pt-6 gap-y-4">
          <div class="px-5 first:pl-0 md:px-8">
            <div class="font-display text-3xl md:text-4xl font-bold tracking-tight text-fg stat-counter tabular-nums" data-target="30" data-suffix="+">30+</div>
            <div class="mt-1 flex items-center gap-1.5 font-cond text-[11px] text-fg-subtle">
              <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"></span>
              public repos on GitHub
            </div>
          </div>
          <div class="px-5 md:px-8">
            <div class="font-display text-3xl md:text-4xl font-bold tracking-tight text-fg stat-counter tabular-nums" data-target="25" data-suffix="+">25+</div>
            <div class="mt-1 flex items-center gap-1.5 font-cond text-[11px] text-fg-subtle">
              <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"></span>
              AI/ML products shipped
            </div>
          </div>
          <div class="px-5 md:px-8">
            <div class="font-display text-3xl md:text-4xl font-bold tracking-tight text-fg stat-counter tabular-nums" data-target="350" data-suffix="+">350+</div>
            <div class="mt-1 flex items-center gap-1.5 font-cond text-[11px] text-fg-subtle">
              <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"></span>
              LeetCode problems solved
            </div>
          </div>
          <div class="px-5 md:px-8">
            <div class="font-display text-3xl md:text-4xl font-bold tracking-tight text-fg stat-counter tabular-nums" data-target="7.66" data-decimals="2" data-suffix="">7.66</div>
            <div class="mt-1 flex items-center gap-1.5 font-cond text-[11px] text-fg-subtle">
              <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"></span>
              B.Tech CGPA
            </div>
          </div>
        </div>

        <!-- Bento Grid -->
        <div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
          
          <!-- Card 1: Profile Portrait -->
          <div class="md:col-span-5 md:row-span-2 relative rounded-2xl border border-theme-border bg-bg-alt overflow-hidden min-h-[380px]">
            <img src="/assets/about-raj.jpg"
                 alt="Portrait of Raj Rathod"
                 loading="lazy"
                 class="absolute inset-0 h-full w-full object-cover object-center transition duration-700 hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent pointer-events-none" aria-hidden="true"></div>
            <div class="absolute inset-x-0 bottom-0 p-6 z-10">
              <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-cond text-[11px] text-white backdrop-blur">
                <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"></span>
                Open to work
              </div>
              <h3 class="font-hero text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Raj Rathod
              </h3>
              <p class="mt-1 font-cond text-white/70">AI &amp; Machine Learning Engineer</p>
            </div>
          </div>

          <!-- Card 2: Philosophy -->
          <div class="md:col-span-7 relative rounded-2xl border border-theme-border bg-bg-alt p-7 md:p-9">
            <h3 class="font-display text-xl md:text-2xl font-medium text-fg">
              Problem solver first, AI engineer second.
            </h3>
            <p class="mt-4 max-w-xl leading-relaxed text-fg-muted font-cond text-base md:text-lg">
              I enjoy turning complex data into intuitive, autonomous digital intelligence. I learn new neural architectures fast, lead end-to-end machine learning lifecycles, and deploy high-speed web apps that deliver real-world utility.
            </p>
            <div class="mt-6 flex flex-wrap gap-2 font-cond text-xs">
              <span class="inline-flex items-center gap-1.5 rounded-full border border-theme-border px-3 py-1 text-fg-muted">
                <i class="fa-solid fa-location-dot text-accent text-xs"></i> Gujarat, India
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full border border-theme-border px-3 py-1 text-fg-muted">
                B.Tech CSE with AI
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full border border-theme-border px-3 py-1 text-fg-muted">
                Deep Learning
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full border border-theme-border px-3 py-1 text-fg-muted">
                Generative AI &amp; RAG
              </span>
            </div>
          </div>

          <!-- Card 3: Currently Focused On -->
          <div class="md:col-span-4 relative rounded-2xl border border-theme-border bg-bg-alt p-7 h-full">
            <div class="font-cond text-[11px] uppercase tracking-wide text-fg-subtle font-semibold">
              Currently focused on
            </div>
            <ul class="mt-4 space-y-3 text-sm font-cond text-fg">
              <li class="flex items-start gap-3">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                <span>Deep Neural Architectures (BiGRU / CNN / Vision)</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                <span>RAG &amp; Context-Aware LLMs (LangChain, ChromaDB)</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                <span>Production AI Deployment (FastAPI, Docker, Streamlit)</span>
              </li>
            </ul>
          </div>

          <!-- Card 4: Latest Ship -->
          <div class="md:col-span-3">
            <a href="https://senti-ai.onrender.com" target="_blank" rel="noopener noreferrer" class="group block h-full">
              <div class="relative block overflow-hidden h-full min-h-[190px] rounded-2xl border border-theme-border bg-bg-alt">
                <img src="/assets/projects/senti-ai.png" alt="SENTI.AI preview" loading="lazy" class="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105 group-hover:opacity-70">
                <div class="absolute inset-0 bg-gradient-to-t from-black to-black/30" aria-hidden="true"></div>
                <div class="relative flex h-full min-h-[190px] flex-col justify-end p-6">
                  <div class="font-cond text-[11px] text-accent font-semibold">Latest ship</div>
                  <div class="mt-1 flex items-center justify-between text-xl font-bold text-white font-hero">
                    SENTI.AI
                    <i class="fa-solid fa-arrow-up-right-from-square text-sm transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"></i>
                  </div>
                </div>
              </div>
            </a>
          </div>

        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
          <a href="https://github.com/Raj-Rathod-Ai" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 font-cond text-sm text-fg-muted transition hover:text-fg">
            <i class="fa-brands fa-github text-base"></i> See everything I'm building on GitHub
          </a>
          <button class="resume-modal-trigger font-cond text-sm text-accent hover:underline font-semibold flex items-center gap-1.5">
            <i class="fa-solid fa-file-pdf"></i> View &amp; Download Resume PDF →
          </button>
        </div>

      </section>

      <!-- ================= 4. TECH ORBIT ================= -->
      ${this.techOrbit.render()}

      <!-- ================= 5. PROJECTS (STACKED STICKY CARDS) ================= -->
      <section id="projects-section" class="flex flex-col items-center bg-bg-alt text-fg rounded-3xl pt-20 md:pt-28 pb-16 md:pb-24 border-t border-theme-border select-none">
        
        <div class="inline-flex items-center gap-2 rounded-full border border-theme-border bg-bg px-3.5 py-1 font-cond text-xs text-fg-muted font-medium mb-5">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
          Projects
        </div>

        <h2 class="text-center font-display font-medium capitalize text-[2rem] sm:text-[2.2rem] md:text-[3.5rem] leading-[1.25] md:leading-[1.2] w-[90%] lg:w-[70%] mb-6 md:mb-9">
          Things I've built, from first idea to live deployment.
        </h2>

        <a href="#contact-section"
           class="group mb-10 md:mb-16 px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-white font-bold text-lg md:text-xl transition-shadow duration-300 hover:shadow-[0_0_40px_5px_rgba(232,96,46,0.5)] cursor-pointer"
           style="background: linear-gradient(96.76deg, #E8602E 5.3%, #340E00 234.66%);">
          Have an idea? Let's talk
        </a>

        <!-- Stacked Sticky Cards -->
        <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 relative">
          ${projectsList.map((p, i) => {
            const isAccent = p.tone === 'accent';
            return `
              <article style="--stick-m: ${12 + i * 14}px; --stick-d: ${96 + i * 22}px; z-index: ${10 + i * 5};"
                       class="project-stack-card relative w-[94%] md:w-[90%] mx-auto mb-10 lg:mb-14 sticky top-[var(--stick-m)] lg:top-[var(--stick-d)] rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:px-12 lg:py-14 shadow-2xl ${
                         isAccent ? 'bg-accent text-white' : 'bg-bg-alt text-fg border border-theme-border'
                       }">
                
                <div class="flex flex-col-reverse lg:gap-16 gap-6 justify-between items-center ${
                  i % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }">
                  
                  <!-- Text side -->
                  <div class="flex flex-col justify-center flex-1 lg:w-1/2 min-w-0">
                    <span class="text-xs font-mono uppercase tracking-widest project-sub ${isAccent ? 'text-white/80' : 'text-accent'} mb-2 font-semibold">
                      ${p.subtitle}
                    </span>
                    <h3 class="font-display font-medium leading-tight text-3xl md:text-4xl lg:text-[3.25rem] mb-3 ${isAccent ? 'text-white' : 'text-fg'}">
                      ${p.title}
                    </h3>
                    <p class="text-base md:text-xl lg:text-xl font-light tracking-wide ${isAccent ? 'text-white/80' : 'text-fg-muted'}">
                      ${p.description}
                    </p>

                    <!-- Stats Chips -->
                    <div class="flex flex-wrap gap-x-8 gap-y-4 mt-6 lg:mt-8">
                      ${p.stats.map(s => `
                        <div class="flex items-center gap-2">
                          <div class="p-3 rounded-xl ${isAccent ? 'bg-white/15 text-white' : 'bg-accent-soft text-accent'}">
                            <i class="${s.icon} text-lg"></i>
                          </div>
                          <div>
                            <p class="font-semibold text-lg leading-tight ${isAccent ? 'text-white' : 'text-fg'}">${s.value}</p>
                            <p class="font-medium text-sm leading-4 opacity-70 ${isAccent ? 'text-white/80' : 'text-fg-muted'} font-cond">${s.label}</p>
                          </div>
                        </div>
                      `).join('')}
                    </div>

                    <!-- Tech Tags + Launch Link -->
                    <div class="mt-8">
                      <div class="flex flex-wrap gap-2 mb-6">
                        ${p.stack.map(tag => `
                          <span class="text-sm font-medium px-3.5 py-1 rounded-full border ${
                            isAccent ? 'border-white/50 text-white' : 'border-accent/40 text-accent'
                          }">
                            ${tag}
                          </span>
                        `).join('')}
                      </div>

                      <div class="flex items-center gap-4">
                        <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer"
                           class="group inline-flex px-8 py-3.5 rounded-2xl font-medium text-lg transition-colors ${
                             isAccent ? 'bg-white text-black hover:bg-neutral-100 shadow-lg' : 'bg-fg text-bg hover:bg-accent hover:text-white'
                           }">
                          <span class="relative block overflow-hidden w-max">
                            <span class="block transition-transform duration-300 ease-out group-hover:-translate-y-full">View Project →</span>
                            <span class="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">Launch App ↗</span>
                          </span>
                        </a>

                        <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer"
                           class="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-medium text-base border transition-colors ${
                             isAccent ? 'border-white/40 text-white hover:bg-white/15' : 'border-theme-border text-fg-muted hover:text-fg hover:border-fg'
                           }">
                          <i class="fa-brands fa-github text-lg"></i>
                          <span>Code</span>
                        </a>
                      </div>
                    </div>

                  </div>

                  <!-- Image side: Clean uncropped app frame matching Pranay -->
                  <div class="shrink-0 w-full lg:w-[42%] h-[30vh] md:h-[38vh] lg:h-[48vh] rounded-2xl overflow-hidden bg-black/5 border border-black/5 shadow-xl relative group">
                    <img src="${p.image}"
                         alt="${p.title} Preview"
                         loading="lazy"
                         class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]">
                  </div>

                </div>

              </article>
            `;
          }).join('')}
        </div>

        <!-- Explore All Projects CTA Button -->
        <div class="mt-12 md:mt-16 text-center select-none">
          <a href="/projects"
             class="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-2xl bg-fg text-bg font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-[0_10px_35px_rgba(246,107,21,0.4)] hover:-translate-y-1 cursor-pointer">
            <span>View All Projects</span>
            <i class="fa-solid fa-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-1.5"></i>
          </a>
          <p class="font-cond text-xs text-fg-muted mt-3">
            Browse all 21+ AI/ML repositories, live Streamlit/Render apps, and full source code
          </p>
        </div>

      </section>

      <!-- ================= 6. TESTIMONIALS (COMMUNITY MARQUEE) ================= -->
      <section id="community" class="py-20 md:py-28 select-none bg-bg text-fg" aria-labelledby="community-title">
        <div class="mx-auto mb-10 max-w-6xl px-5 md:mb-14 md:px-8">
          <div class="inline-flex items-center gap-2 rounded-full border border-theme-border bg-bg-alt px-3.5 py-1 font-cond text-xs text-fg-muted font-medium mb-4">
            <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
            Community
          </div>
          <h2 id="community-title" class="max-w-2xl font-hero font-bold leading-tight tracking-tight text-fg"
              style="font-size: clamp(1.75rem, 4.5vw, 3rem);">
            The community I learn and build with
          </h2>
          <p class="mt-4 max-w-2xl text-fg-muted font-cond text-base md:text-lg">
            Real feedback from professors, teammates, clients, and technical mentors — the engineering culture I thrive in.
          </p>
        </div>

        <div class="testimonial-marquee-wrap overflow-hidden"
             style="mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);"
             tabindex="0"
             aria-label="Community reviews">
          <div class="testimonial-marquee flex gap-4">
            ${[...testimonials, ...testimonials].map(r => `
              <figure class="w-[280px] sm:w-[340px] shrink-0 rounded-2xl border border-theme-border bg-bg-alt p-6">
                <div class="flex items-center gap-1 text-accent" role="img" aria-label="${r.rating} out of 5 stars">
                  ${[1, 2, 3, 4, 5].map(() => '<i class="fa-solid fa-star text-xs"></i>').join('')}
                  <span class="ml-2 font-suisse-mono text-xs text-fg-subtle">${r.rating.toFixed(1)}</span>
                </div>
                <blockquote class="mt-4 text-[15px] leading-relaxed text-fg font-cond">
                  "${r.text}"
                </blockquote>
                <figcaption class="mt-6 flex items-center gap-3">
                  <span class="grid h-10 w-10 place-items-center rounded-full border border-accent/50 bg-accent/10 font-suisse-mono text-xs text-accent font-bold" aria-hidden="true">
                    ${r.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <span class="block text-sm font-semibold text-fg">${r.name}</span>
                    <span class="block text-xs text-fg-subtle font-cond">${r.role}</span>
                  </div>
                </figcaption>
              </figure>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- ================= 7. GALLERY (BENTO GRID WITH REAL MEDIA) ================= -->
      <section id="gallery-section" class="w-full flex flex-col items-center bg-bg-alt text-fg rounded-3xl pt-20 pb-16 md:pb-24 border-t border-theme-border select-none">
        
        <div class="inline-flex items-center gap-2 rounded-full border border-theme-border bg-bg px-3.5 py-1 font-cond text-xs text-fg-muted font-medium mb-4">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
          Gallery
        </div>

        <h2 class="text-center font-display font-medium capitalize text-[2rem] sm:text-[2.2rem] md:text-[3.5rem] leading-[1.25] md:leading-[1.2] w-[90%] lg:w-[70%] mt-2 mb-8 md:mb-14">
          Moments, memories &amp; milestones.
        </h2>

        <div class="w-full px-4 md:px-6 lg:px-20 max-w-[1600px]">
          <!-- Masonry Gallery Grid (Auto-detected videos & photos, proper native aspect ratios, zero titles) -->
          <div id="gallery-grid" class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-5 space-y-4 md:space-y-5">
            
            <!-- Item 1: Photo (IMG-20260605-WA0003.jpg) -->
            <div class="gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-black/10 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer" data-media-type="image" data-src="/gallery-media/IMG-20260605-WA0003.jpg">
              <img src="/gallery-media/IMG-20260605-WA0003.jpg" alt="Raj Rathod Gallery" loading="lazy" class="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]">
              <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                  <i class="fa-solid fa-expand text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Item 2: Video 1 (VID_20261004_194759_022.mp4) -->
            <div class="gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-[#0a0d14] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer" data-media-type="video" data-src="/gallery-media/VID_20261004_194759_022.mp4">
              <video src="/gallery-media/VID_20261004_194759_022.mp4#t=0.001" muted loop playsinline webkit-playsinline preload="metadata" class="gallery-video w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]"></video>
              <div class="gallery-play-badge absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300">
                <div class="w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-play text-xs ml-0.5 text-accent"></i>
                </div>
              </div>
              <div class="gallery-buffer-spinner absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                <div class="w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-accent flex items-center justify-center shadow-lg">
                  <i class="fa-solid fa-circle-notch fa-spin text-sm text-accent"></i>
                </div>
              </div>
              <div class="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button class="gallery-audio-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Toggle Sound" aria-label="Toggle sound">
                  <i class="fa-solid fa-volume-xmark text-xs"></i>
                </button>
                <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                  <i class="fa-solid fa-expand text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Item 3: Video 2 (VID-20250924-WA0000.mp4) -->
            <div class="gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-[#0a0d14] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer" data-media-type="video" data-src="/gallery-media/VID-20250924-WA0000.mp4">
              <video src="/gallery-media/VID-20250924-WA0000.mp4#t=0.001" muted loop playsinline webkit-playsinline preload="metadata" class="gallery-video w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]"></video>
              <div class="gallery-play-badge absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300">
                <div class="w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-play text-xs ml-0.5 text-accent"></i>
                </div>
              </div>
              <div class="gallery-buffer-spinner absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                <div class="w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-accent flex items-center justify-center shadow-lg">
                  <i class="fa-solid fa-circle-notch fa-spin text-sm text-accent"></i>
                </div>
              </div>
              <div class="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button class="gallery-audio-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Toggle Sound" aria-label="Toggle sound">
                  <i class="fa-solid fa-volume-xmark text-xs"></i>
                </button>
                <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                  <i class="fa-solid fa-expand text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Item 4: Photo 2 (IMG-20260605-WA0006.jpg) -->
            <div class="gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-black/10 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer" data-media-type="image" data-src="/gallery-media/IMG-20260605-WA0006.jpg">
              <img src="/gallery-media/IMG-20260605-WA0006.jpg" alt="Raj Rathod Gallery" loading="lazy" class="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]">
              <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                  <i class="fa-solid fa-expand text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Item 5: Video 3 (VID_20260129_122517_951.mp4) -->
            <div class="gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-[#0a0d14] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer" data-media-type="video" data-src="/gallery-media/VID_20260129_122517_951.mp4">
              <video src="/gallery-media/VID_20260129_122517_951.mp4#t=0.001" muted loop playsinline webkit-playsinline preload="metadata" class="gallery-video w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]"></video>
              <div class="gallery-play-badge absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300">
                <div class="w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-play text-xs ml-0.5 text-accent"></i>
                </div>
              </div>
              <div class="gallery-buffer-spinner absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                <div class="w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-accent flex items-center justify-center shadow-lg">
                  <i class="fa-solid fa-circle-notch fa-spin text-sm text-accent"></i>
                </div>
              </div>
              <div class="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button class="gallery-audio-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Toggle Sound" aria-label="Toggle sound">
                  <i class="fa-solid fa-volume-xmark text-xs"></i>
                </button>
                <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                  <i class="fa-solid fa-expand text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Item 6: Video 4 (video_20250927_222326.mp4) -->
            <div class="gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-[#0a0d14] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer" data-media-type="video" data-src="/gallery-media/video_20250927_222326.mp4">
              <video src="/gallery-media/video_20250927_222326.mp4#t=0.001" muted loop playsinline webkit-playsinline preload="metadata" class="gallery-video w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]"></video>
              <div class="gallery-play-badge absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300">
                <div class="w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-play text-xs ml-0.5 text-accent"></i>
                </div>
              </div>
              <div class="gallery-buffer-spinner absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                <div class="w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-accent flex items-center justify-center shadow-lg">
                  <i class="fa-solid fa-circle-notch fa-spin text-sm text-accent"></i>
                </div>
              </div>
              <div class="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button class="gallery-audio-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Toggle Sound" aria-label="Toggle sound">
                  <i class="fa-solid fa-volume-xmark text-xs"></i>
                </button>
                <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                  <i class="fa-solid fa-expand text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Item 7: Video 5 (video_20250927_023728_edit.mp4) -->
            <div class="gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-[#0a0d14] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer" data-media-type="video" data-src="/gallery-media/video_20250927_023728_edit.mp4">
              <video src="/gallery-media/video_20250927_023728_edit.mp4#t=0.001" muted loop playsinline webkit-playsinline preload="metadata" class="gallery-video w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]"></video>
              <div class="gallery-play-badge absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300">
                <div class="w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-play text-xs ml-0.5 text-accent"></i>
                </div>
              </div>
              <div class="gallery-buffer-spinner absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                <div class="w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-accent flex items-center justify-center shadow-lg">
                  <i class="fa-solid fa-circle-notch fa-spin text-sm text-accent"></i>
                </div>
              </div>
              <div class="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button class="gallery-audio-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Toggle Sound" aria-label="Toggle sound">
                  <i class="fa-solid fa-volume-xmark text-xs"></i>
                </button>
                <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                  <i class="fa-solid fa-expand text-xs"></i>
                </button>
              </div>
            </div>

          </div>

        </div>

      </section>

      <!-- ================= 8. CONTACT (GLOW BOX WITH CORNER DOTS) ================= -->
      <section id="contact-section" class="w-full bg-bg text-fg px-5 md:px-8 py-16 md:py-24 select-none">
        
        <div class="ct-box relative mx-auto max-w-6xl rounded-3xl border border-accent/50 px-6 py-16 md:px-16 md:py-24 flex flex-col items-center text-center overflow-hidden">
          <div aria-hidden="true" class="ct-box-glow pointer-events-none absolute inset-0"></div>

          <!-- 4 Corner Dots -->
          <span class="absolute w-[6px] h-[6px] rounded-full bg-accent top-4 left-4"></span>
          <span class="absolute w-[6px] h-[6px] rounded-full bg-accent top-4 right-4"></span>
          <span class="absolute w-[6px] h-[6px] rounded-full bg-accent bottom-4 left-4"></span>
          <span class="absolute w-[6px] h-[6px] rounded-full bg-accent bottom-4 right-4"></span>

          <h2 class="relative font-hero font-bold leading-[1.1] tracking-tight text-fg"
              style="font-size: clamp(1.9rem, 5.2vw, 4.25rem);">
            <span>Have an idea? Let's build it and </span>
            <span class="ct-shipit inline-flex items-center rounded-full border border-accent px-5 py-1 text-accent">
              ship it
            </span>
          </h2>

          <h3 class="relative about-accent-text font-semibold lowercase pointer-events-none leading-[0.9] m-0 mt-6 md:mt-10"
              style="font-size: clamp(2.5rem, 13vw, 12rem); letter-spacing: -0.07em;">
            let's talk.
          </h3>

          <p class="relative mt-8 md:mt-10 max-w-xl text-base md:text-lg leading-relaxed text-fg-muted font-cond">
            Open to AI/ML engineering roles, internships, collaborative research, and production projects. Tell me what you're building and I'll reply fast.
          </p>

          <div class="relative flex items-center gap-3 md:gap-4 mt-9 flex-wrap justify-center">
            <a href="mailto:rathodraj1504@gmail.com"
               class="ct-btn-primary inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 group">
              <i class="fa-solid fa-envelope text-xs"></i>
              <span>Chat on Email</span>
            </a>
            <a href="/api/whatsapp"
               id="whatsapp-contact-link"
               target="_blank"
               rel="noopener noreferrer"
               class="ct-btn-secondary inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 group">
              <i class="fa-brands fa-whatsapp text-lg text-emerald-400"></i>
              <span>Chat on WhatsApp</span>
            </a>
            <button id="toggle-contact-form-btn"
                    type="button"
                    class="ct-btn-secondary inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group">
              <i class="fa-solid fa-envelope-open-text text-accent group-hover:scale-110 transition-transform"></i>
              <span id="toggle-form-btn-text">Direct Message Form</span>
            </button>
          </div>

          <!-- Interactive Direct Message Form Card (Toggled by Direct Message Form button) -->
          <div id="contact-form-container" class="hidden w-full max-w-2xl mt-10 text-left bg-bg-alt backdrop-blur-xl border border-theme-border rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 transition-all duration-500">
            <div class="flex items-center justify-between pb-4 mb-6 border-b border-theme-border">
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-accent animate-ping"></span>
                <h4 class="font-hero text-lg sm:text-xl font-bold text-fg">Send a Direct Message</h4>
              </div>
              <span class="text-xs font-mono text-fg-muted flex items-center gap-1.5"><i class="fa-solid fa-bolt text-accent text-[10px]"></i> Fast Response</span>
            </div>

            <form id="contact-direct-form" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="contact-name" class="block text-xs font-mono uppercase tracking-wider text-fg-muted mb-1.5">Your Name *</label>
                  <input type="text" id="contact-name" name="name" required placeholder="John Doe"
                         class="w-full px-4 py-3 rounded-xl bg-bg border border-theme-border text-fg placeholder:text-fg-subtle text-sm focus:outline-none focus:border-accent transition-colors">
                </div>
                <div>
                  <label for="contact-email" class="block text-xs font-mono uppercase tracking-wider text-fg-muted mb-1.5">Email Address *</label>
                  <input type="email" id="contact-email" name="email" required placeholder="john@example.com"
                         class="w-full px-4 py-3 rounded-xl bg-bg border border-theme-border text-fg placeholder:text-fg-subtle text-sm focus:outline-none focus:border-accent transition-colors">
                </div>
              </div>

              <div>
                <label for="contact-subject" class="block text-xs font-mono uppercase tracking-wider text-fg-muted mb-1.5">Subject / Opportunity</label>
                <input type="text" id="contact-subject" name="subject" placeholder="AI Engineering Role / Project Proposal / Collaboration"
                       class="w-full px-4 py-3 rounded-xl bg-bg border border-theme-border text-fg placeholder:text-fg-subtle text-sm focus:outline-none focus:border-accent transition-colors">
              </div>

              <div>
                <label for="contact-message" class="block text-xs font-mono uppercase tracking-wider text-fg-muted mb-1.5">Message Details *</label>
                <textarea id="contact-message" name="message" rows="4" required placeholder="Describe your proposal, requirements, or idea..."
                          class="w-full px-4 py-3 rounded-xl bg-bg border border-theme-border text-fg placeholder:text-fg-subtle text-sm focus:outline-none focus:border-accent transition-colors resize-y"></textarea>
              </div>

              <div id="contact-form-status" class="hidden"></div>

              <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <span class="text-xs font-cond text-fg-muted">
                  <i class="fa-solid fa-lock text-[10px] mr-1"></i> Transmitted directly to Raj Rathod &bull; Fast turnaround
                </span>
                <button type="submit" id="contact-submit-btn"
                        class="ct-btn-primary inline-flex items-center justify-center gap-2 px-8 h-12 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 cursor-pointer">
                  <i class="fa-solid fa-paper-plane text-xs"></i>
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </section>

      <!-- Clean Lightbox Modal (Fixed viewport centered player, no page scroll jump) -->
      <div id="gallery-lightbox" class="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-2xl items-center justify-center p-4 md:p-8 hidden opacity-0 pointer-events-none transition-opacity duration-300">
        <button id="gallery-lightbox-close" class="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 cursor-pointer border border-white/15" title="Close" aria-label="Close modal">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
        <div id="gallery-lightbox-content" class="relative max-w-5xl max-h-[90vh] w-auto h-auto flex flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl">
        </div>
      </div>
    `;
  }

  setup() {
    // 1. Setup Hero and TechOrbit components
    this.hero.setup();
    this.techOrbit.setup();

    // 2. Gallery System: Auto-detection, Smart Autoplay, Audio Toggle & Pure Media Lightbox
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const lightboxContent = document.getElementById('gallery-lightbox-content');
    const lightboxClose = document.getElementById('gallery-lightbox-close');

    const openLightbox = (type, src) => {
      const modal = document.getElementById('gallery-lightbox');
      const content = document.getElementById('gallery-lightbox-content');
      if (!modal || !content) return;

      // Pause any playing inline gallery video
      pauseAllVideos();

      // Ensure modal is attached directly to document.body so no section transform/overflow restricts it
      if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
      }

      // Freeze scrolling safely without any page jump or scroll-to-center
      if (window.lenis && typeof window.lenis.stop === 'function') {
        window.lenis.stop();
      }
      document.documentElement.classList.add('lightbox-open');

      if (type === 'video') {
        content.innerHTML = `
          <div class="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center p-2 z-10" onclick="event.stopPropagation()">
            <div class="relative w-full max-h-[78vh] flex items-center justify-center">
              <video id="modal-video-element" src="${src}" autoplay controls playsinline webkit-playsinline preload="auto" class="max-w-full max-h-[78vh] w-auto h-auto rounded-2xl shadow-2xl block object-contain mx-auto bg-black"></video>
              <div id="modal-video-spinner" class="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300">
                <div class="w-14 h-14 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-accent flex items-center justify-center shadow-2xl">
                  <i class="fa-solid fa-circle-notch fa-spin text-2xl text-accent"></i>
                </div>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between w-full max-w-md px-2">
              <button id="modal-fs-btn" class="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium flex items-center gap-2 backdrop-blur-md transition-colors cursor-pointer border border-white/20">
                <i class="fa-solid fa-expand"></i> Fullscreen
              </button>
              <span class="text-xs text-white/60 font-mono">Press Esc to exit</span>
            </div>
          </div>
        `;
        const vEl = content.querySelector('#modal-video-element');
        const spinner = content.querySelector('#modal-video-spinner');
        const fsBtn = content.querySelector('#modal-fs-btn');
        if (vEl && spinner) {
          vEl.addEventListener('waiting', () => spinner.classList.remove('opacity-0'));
          vEl.addEventListener('playing', () => spinner.classList.add('opacity-0'));
          vEl.addEventListener('canplay', () => spinner.classList.add('opacity-0'));
          vEl.addEventListener('error', () => {
            spinner.innerHTML = '<span class="text-xs text-red-400">Failed to load video</span>';
          });
        }
        if (fsBtn && vEl) {
          fsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (vEl.requestFullscreen) {
              vEl.requestFullscreen().catch(() => {});
            } else if (vEl.webkitRequestFullscreen) {
              vEl.webkitRequestFullscreen();
            }
          });
        }
      } else {
        content.innerHTML = `
          <div class="relative max-w-4xl max-h-[85vh] flex items-center justify-center p-2 z-10" onclick="event.stopPropagation()">
            <img src="${src}" alt="Gallery Preview" class="max-w-full max-h-[82vh] rounded-2xl shadow-2xl object-contain block mx-auto">
          </div>
        `;
      }

      modal.classList.add('active');
      modal.classList.remove('hidden', 'pointer-events-none', 'opacity-0');
    };

    const closeLightbox = () => {
      const modal = document.getElementById('gallery-lightbox');
      if (!modal) return;
      const vEl = modal.querySelector('#modal-video-element');
      if (vEl) {
        vEl.pause();
        vEl.removeAttribute('src');
        vEl.load();
      }
      modal.classList.remove('active');
      modal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        modal.classList.add('hidden');
        const content = document.getElementById('gallery-lightbox-content');
        if (content) content.innerHTML = '';
        document.documentElement.classList.remove('lightbox-open');
        if (window.lenis && typeof window.lenis.start === 'function') {
          window.lenis.start();
        }
      }, 250);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (galleryLightbox) {
      galleryLightbox.addEventListener('click', (e) => {
        if (e.target === galleryLightbox) closeLightbox();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && galleryLightbox && galleryLightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Single active video tracker: Ensures only the hovered video plays and all other videos are paused
    let currentlyPlayingVideo = null;

    const pauseAllVideos = () => {
      document.querySelectorAll('#gallery-grid video').forEach(v => {
        if (!v.paused) {
          v.pause();
        }
      });
      currentlyPlayingVideo = null;
    };

    const bindGalleryCardEvents = (card) => {
      const type = card.dataset.mediaType;
      const src = card.dataset.src;
      const video = card.querySelector('video');
      const audioBtn = card.querySelector('.gallery-audio-btn');
      const zoomBtn = card.querySelector('.gallery-zoom-btn');
      const playBadge = card.querySelector('.gallery-play-badge');
      const bufferSpinner = card.querySelector('.gallery-buffer-spinner');

      if (type === 'video' && video) {
        const isTouch = (window.matchMedia && window.matchMedia('(pointer: coarse), (hover: none)').matches) || window.innerWidth < 768;

        if (!isTouch) {
          // DESKTOP: Smooth Hover To Play
          card.addEventListener('mouseenter', () => {
            if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
              currentlyPlayingVideo.pause();
            }
            currentlyPlayingVideo = video;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          });

          card.addEventListener('mouseleave', () => {
            video.pause();
            if (currentlyPlayingVideo === video) {
              currentlyPlayingVideo = null;
            }
          });
        }

        // Clicking card opens centered screen modal player cleanly without page jumps
        card.addEventListener('click', (e) => {
          if (e.target.closest('.gallery-audio-btn')) return;
          e.preventDefault();
          e.stopPropagation();
          video.pause();
          openLightbox('video', src);
        });

        // Buffering & play state synchronization
        video.addEventListener('waiting', () => {
          if (bufferSpinner) bufferSpinner.classList.remove('opacity-0');
        });
        video.addEventListener('playing', () => {
          if (bufferSpinner) bufferSpinner.classList.add('opacity-0');
          if (playBadge) playBadge.style.opacity = '0';
        });
        video.addEventListener('canplay', () => {
          if (bufferSpinner) bufferSpinner.classList.add('opacity-0');
        });
        video.addEventListener('pause', () => {
          if (bufferSpinner) bufferSpinner.classList.add('opacity-0');
          if (playBadge) playBadge.style.opacity = '1';
        });
      } else {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox('image', src);
        });
      }

      if (zoomBtn) {
        zoomBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (video) video.pause();
          openLightbox(type, src);
        });
      }

      if (audioBtn && video) {
        audioBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          video.muted = !video.muted;
          const icon = audioBtn.querySelector('i');
          if (icon) {
            icon.className = video.muted ? 'fa-solid fa-volume-xmark text-xs' : 'fa-solid fa-volume-high text-xs text-accent';
          }
          if (video.paused) {
            pauseAllVideos();
            currentlyPlayingVideo = video;
            video.play().catch(() => {});
          }
        });
      }
    };

    // Attach hover-to-play interactions to all pre-rendered gallery cards
    document.querySelectorAll('#gallery-grid .gallery-card').forEach(bindGalleryCardEvents);

    // Auto-detect newly added files in gallery-media/
    const autoDetectGallery = async () => {
      try {
        let discovered = null;

        // 1. Try local Express /api/gallery
        try {
          const apiRes = await fetch('/api/gallery', { cache: 'no-store' });
          if (apiRes.ok) {
            const data = await apiRes.json();
            if (data.media && data.media.length > 0) discovered = data.media;
          }
        } catch (_) {}

        // 2. Try directory listing /gallery-media/ (Python SimpleHTTP server)
        if (!discovered) {
          try {
            const dirRes = await fetch('/gallery-media/', { cache: 'no-store' });
            if (dirRes.ok) {
              const html = await dirRes.text();
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const links = Array.from(doc.querySelectorAll('a[href]'));
              const vidExts = ['.mp4', '.webm', '.mov', '.ogg', '.m4v'];
              const imgExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
              const list = [];
              for (const a of links) {
                const href = a.getAttribute('href') || '';
                const cleanHref = href.split('?')[0].split('#')[0];
                const file = cleanHref.split('/').pop();
                if (!file || file === 'manifest.json' || file.startsWith('.')) continue;
                const lower = file.toLowerCase();
                if (vidExts.some(ext => lower.endsWith(ext))) {
                  list.push({ name: file, src: `/gallery-media/${file}`, type: 'video' });
                } else if (imgExts.some(ext => lower.endsWith(ext))) {
                  list.push({ name: file, src: `/gallery-media/${file}`, type: 'image' });
                }
              }
              if (list.length > 0) discovered = list;
            }
          } catch (_) {}
        }

        // 3. Try /gallery-media/manifest.json (static hosting)
        if (!discovered) {
          try {
            const mRes = await fetch('/gallery-media/manifest.json?v=' + Date.now(), { cache: 'no-store' });
            if (mRes.ok) {
              const data = await mRes.json();
              if (data.media && data.media.length > 0) discovered = data.media;
            }
          } catch (_) {}
        }

        if (discovered && discovered.length > 0 && galleryGrid) {
          const renderedSrcs = new Set(Array.from(galleryGrid.querySelectorAll('.gallery-card')).map(c => c.dataset.src));
          let hasNew = false;
          discovered.forEach(item => {
            if (!renderedSrcs.has(item.src)) {
              hasNew = true;
              const cardDiv = document.createElement('div');
              if (item.type === 'video') {
                cardDiv.className = 'gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-[#0a0d14] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer';
                cardDiv.dataset.mediaType = 'video';
                cardDiv.dataset.src = item.src;
                cardDiv.innerHTML = `
                  <video src="${item.src}#t=0.001" muted loop playsinline webkit-playsinline preload="metadata" class="gallery-video w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]"></video>
                  <div class="gallery-play-badge absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300">
                    <div class="w-11 h-11 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-play text-xs ml-0.5 text-accent"></i>
                    </div>
                  </div>
                  <div class="gallery-buffer-spinner absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                    <div class="w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-accent flex items-center justify-center shadow-lg">
                      <i class="fa-solid fa-circle-notch fa-spin text-sm text-accent"></i>
                    </div>
                  </div>
                  <div class="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button class="gallery-audio-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Toggle Sound" aria-label="Toggle sound">
                      <i class="fa-solid fa-volume-xmark text-xs"></i>
                    </button>
                    <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                      <i class="fa-solid fa-expand text-xs"></i>
                    </button>
                  </div>
                `;
              } else {
                cardDiv.className = 'gallery-card break-inside-avoid group relative overflow-hidden rounded-2xl md:rounded-3xl border border-theme-border bg-black/10 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer';
                cardDiv.dataset.mediaType = 'image';
                cardDiv.dataset.src = item.src;
                cardDiv.innerHTML = `
                  <img src="${item.src}" alt="Raj Rathod Gallery" loading="lazy" class="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-[1.02]">
                  <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button class="gallery-zoom-btn w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent transition-colors" title="Fullscreen View" aria-label="Fullscreen view">
                      <i class="fa-solid fa-expand text-xs"></i>
                    </button>
                  </div>
                `;
              }
              galleryGrid.appendChild(cardDiv);
              bindGalleryCardEvents(cardDiv);
            }
          });
        }
      } catch (err) {
        console.warn('Gallery auto-detection notice:', err);
      }
    };

    autoDetectGallery();

    // 4. Smooth Anchor Scrolling with Lenis integration
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1 && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            if (window.__lenis?.scrollTo) {
              window.__lenis.scrollTo(target, { offset: 0, duration: 1.4 });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });

    // 5. Stat Counters Count-Up with smooth cubic easing
    const counters = document.querySelectorAll('.stat-counter');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0');
          const duration = 1400;
          const start = performance.now();

          const step = (time) => {
            const rawProgress = Math.min((time - start) / duration, 1);
            // Cubic ease-out: brisk start, elegant slow settle
            const progress = 1 - Math.pow(1 - rawProgress, 3);
            const current = progress * target;
            el.textContent = current.toFixed(decimals) + suffix;
            if (rawProgress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target.toFixed(decimals) + suffix;
            }
          };
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));


    // Breaker line fade-in on hero scroll
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const endLine = document.querySelector('.hero-end-line');
      const heroSection = document.getElementById('hero-section');
      if (endLine && heroSection) {
        gsap.set(endLine, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: '+=300',
          scrub: true,
          animation: gsap.to(endLine, { autoAlpha: 1, ease: 'none' })
        });
      }
    }

    // 7. Direct Message Contact Form Controller
    const contactForm = document.getElementById('contact-direct-form');
    const contactContainer = document.getElementById('contact-form-container');
    const toggleFormBtn = document.getElementById('toggle-contact-form-btn');
    const formStatus = document.getElementById('contact-form-status');
    const submitBtn = document.getElementById('contact-submit-btn');

    const toggleBtnText = document.getElementById('toggle-form-btn-text');

    const closeContactForm = () => {
      if (contactContainer && !contactContainer.classList.contains('hidden')) {
        contactContainer.classList.add('hidden');
        if (toggleBtnText) toggleBtnText.textContent = 'Direct Message Form';
        toggleFormBtn?.classList.remove('border-accent');
      }
    };

    if (toggleFormBtn && contactContainer) {
      toggleFormBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = contactContainer.classList.contains('hidden');
        if (isHidden) {
          contactContainer.classList.remove('hidden');
          if (toggleBtnText) toggleBtnText.textContent = 'Close Message Form';
          toggleFormBtn.classList.add('border-accent');
          setTimeout(() => {
            contactContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const nameInput = document.getElementById('contact-name');
            if (nameInput) nameInput.focus();
          }, 100);
        } else {
          closeContactForm();
        }
      });

      // Prevent clicks inside the form card from closing it
      contactContainer.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Clicking any other side of the page dismisses the form
      document.addEventListener('click', () => {
        closeContactForm();
      });

      // Pressing Escape closes the form
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeContactForm();
      });
    }

    // WhatsApp Direct Link Controller (reliable redirect without exposing number in page text)
    const waLink = document.getElementById('whatsapp-contact-link');
    if (waLink) {
      waLink.addEventListener('click', (e) => {
        e.preventDefault();
        const p = atob('OTE5NjI0ODAxMDE0'); // 919624801014
        const targetUrl = `https://wa.me/${p}?text=` + encodeURIComponent('Hi Raj, I saw your portfolio and would like to connect!');
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      });
    }

    if (contactForm && submitBtn) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = (document.getElementById('contact-name')?.value || '').trim();
        const email = (document.getElementById('contact-email')?.value || '').trim();
        const subject = (document.getElementById('contact-subject')?.value || '').trim();
        const message = (document.getElementById('contact-message')?.value || '').trim();

        if (!email || !email.includes('@')) {
          if (formStatus) {
            formStatus.className = 'p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-sans text-xs';
            formStatus.textContent = 'Please enter a valid email address.';
            formStatus.classList.remove('hidden');
          }
          return;
        }

        if (!message) {
          if (formStatus) {
            formStatus.className = 'p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-sans text-xs';
            formStatus.textContent = 'Please enter a message or project overview.';
            formStatus.classList.remove('hidden');
          }
          return;
        }

        // Loading state
        submitBtn.disabled = true;
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-xs"></i> <span>Transmitting...</span>';
        if (formStatus) {
          formStatus.className = 'p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-sans text-xs flex items-center gap-2';
          formStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-accent"></i> <span>Dispatching transmission to Raj Rathod...</span>';
          formStatus.classList.remove('hidden');
        }

        let sentSuccess = false;
        let receiptDispatched = false;

        try {
          const apiUrl = getApiBaseUrl();
          const endpoints = apiUrl ? [`${apiUrl}/api/contact`, '/api/contact'] : ['/api/contact'];

          for (const ep of endpoints) {
            try {
              const res = await fetch(ep, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
              });
              if (res.ok) {
                sentSuccess = true;
                const data = await res.json().catch(() => ({}));
                receiptDispatched = !!data.receiptDispatched;
                break;
              }
            } catch (errInner) {
              // Try next endpoint
            }
          }
        } catch (err) {
          console.warn('Contact form dispatch notice:', err);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        if (sentSuccess) {
          contactForm.reset();
          if (formStatus) {
            formStatus.className = 'p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-sans text-sm';
            formStatus.innerHTML = `
              <div class="flex items-center gap-2.5 font-bold text-white mb-1">
                <i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>
                <span>Message Received Successfully!</span>
              </div>
              <p class="text-xs text-white/80 leading-relaxed font-cond">
                ${receiptDispatched 
                  ? `Thank you, ${name || 'colleague'}. Your message has been sent directly to Raj's desk. An automatic confirmation receipt was dispatched to <strong>${email}</strong>.`
                  : `Thank you, ${name || 'colleague'}. Your transmission has been received directly at Raj's desk. Raj will evaluate your inquiry and reply to <strong>${email}</strong> shortly.`
                }
              </p>
            `;
          }
        } else {
          // Graceful fallback with 1-click mailto or WhatsApp dispatch
          const mailSubject = encodeURIComponent(subject || 'Portfolio Inquiry from ' + (name || 'Colleague'));
          const mailBody = encodeURIComponent(`Hi Raj,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
          const waText = encodeURIComponent(`Hi Raj, my name is ${name} (${email}). ${message}`);

          if (formStatus) {
            formStatus.className = 'p-4 rounded-2xl bg-white/10 border border-white/20 text-white font-sans text-sm';
            formStatus.innerHTML = `
              <div class="flex items-center gap-2.5 font-bold text-accent mb-1">
                <i class="fa-solid fa-paper-plane text-accent"></i>
                <span>Direct Mail Dispatch Ready</span>
              </div>
              <p class="text-xs text-white/80 leading-relaxed font-cond mb-3">
                Send directly via your native mail client or WhatsApp:
              </p>
              <div class="flex items-center gap-2.5 flex-wrap">
                <a href="mailto:rathodraj1504@gmail.com?subject=${mailSubject}&body=${mailBody}"
                   class="px-4 py-2 rounded-xl bg-accent text-white font-semibold text-xs transition-transform hover:-translate-y-0.5">
                  <i class="fa-solid fa-envelope mr-1.5"></i> Open in Mail Client
                </a>
                <a href="${(typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '8080' ? 'https://portfolio-raj-qda3.onrender.com' : (getApiBaseUrl() || ''))}/api/whatsapp?text=${waText}" target="_blank" rel="noopener noreferrer"
                   class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs transition-transform hover:-translate-y-0.5">
                  <i class="fa-brands fa-whatsapp mr-1.5"></i> Send on WhatsApp
                </a>
              </div>
            `;
          }
        }
      });
    }
  }
}
