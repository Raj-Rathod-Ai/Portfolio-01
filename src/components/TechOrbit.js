/**
 * TechOrbit Component - Interactive SolarSystem 3D Tech Orbit for Raj Rathod.
 * Features:
 * - 3D perspective stage with rotateX(65deg) rotateY(-10deg)
 * - Concentric orbital rings (inner, mid, outer) with billboard counter-rotation
 * - Ambient orbiting cosmic dust particles
 * - Central pulsating star/core with double dashed rotating rings
 * - Interactive laser connection line from center to planet on hover
 * - Full responsive radius scaling (desktop -> tablet -> mobile)
 */
export class TechOrbit {
  constructor() {
    this.dustItems = [
      { delay: '-4s', radius: '165px', color: '#00f5d4' },
      { delay: '-11s', radius: '260px', color: '#a855f7' },
      { delay: '-19s', radius: '340px', color: '#38bdf8' },
      { delay: '-28s', radius: '395px', color: '#00f5d4' },
      { delay: '-7s', radius: '200px', color: '#ec4899' },
      { delay: '-15s', radius: '365px', color: '#eab308' },
      { delay: '-23s', radius: '430px', color: '#a855f7' },
    ];

    this.orbits = [
      {
        id: 'inner',
        radiusClass: 'var(--radius-inner)',
        speed: 22,
        items: [
          { id: 'python', label: 'Python', color: '#38bdf8', icon: '<i class="fa-brands fa-python text-base"></i>' },
          { id: 'pytorch', label: 'PyTorch', color: '#ef4444', icon: '<i class="fa-solid fa-fire text-base"></i>' },
          { id: 'tensorflow', label: 'TensorFlow', color: '#f97316', icon: '<i class="fa-solid fa-diagram-project text-base"></i>' },
        ]
      },
      {
        id: 'mid',
        radiusClass: 'var(--radius-mid)',
        speed: 34,
        items: [
          { id: 'opencv', label: 'OpenCV', color: '#14b8a6', icon: '<i class="fa-solid fa-eye text-base"></i>' },
          { id: 'langchain', label: 'LangChain', color: '#a855f7', icon: '<i class="fa-solid fa-link text-base"></i>' },
          { id: 'huggingface', label: 'Hugging Face', color: '#facc15', icon: '<i class="fa-solid fa-face-smile text-base"></i>' },
          { id: 'fastapi', label: 'FastAPI', color: '#10b981', icon: '<i class="fa-solid fa-bolt text-base"></i>' },
        ]
      },
      {
        id: 'outer',
        radiusClass: 'var(--radius-outer)',
        speed: 48,
        items: [
          { id: 'streamlit', label: 'Streamlit', color: '#f43f5e', icon: '<i class="fa-solid fa-chart-pie text-base"></i>' },
          { id: 'docker', label: 'Docker', color: '#38bdf8', icon: '<i class="fa-brands fa-docker text-base"></i>' },
          { id: 'mongodb', label: 'MongoDB', color: '#22c55e', icon: '<i class="fa-solid fa-database text-base"></i>' },
          { id: 'chromadb', label: 'ChromaDB', color: '#818cf8', icon: '<i class="fa-solid fa-gem text-base"></i>' },
        ]
      }
    ];
  }

  render() {
    return `
      <section id="tech-orbit" class="w-full min-h-screen flex flex-col items-center justify-center gap-6 px-4 pt-10 pb-16 md:pt-16 md:pb-24 overflow-x-hidden select-none bg-bg text-fg">
        
        <!-- Section Badge -->
        <div class="flex items-center gap-2 -mt-4 md:-mt-6">
          <span class="w-2.5 h-2.5 rounded-full bg-accent"></span>
          <span class="text-xl md:text-3xl font-bold tracking-[0.2em] uppercase about-accent-text font-label">
            Tech Stack
          </span>
        </div>

        <!-- 3D Solar System Stage Container -->
        <div class="relative flex items-center justify-center w-full max-w-[940px] h-[340px] md:h-[480px] perspective-[1200px] select-none overflow-visible my-4">
          
          <div class="absolute w-[360px] h-[360px] md:w-[940px] md:h-[940px] flex items-center justify-center"
               style="transform: rotateX(65deg) rotateY(-10deg); transform-style: preserve-3d;">
            
            <!-- Central Sun / Star -->
            <div class="absolute w-[100px] h-[100px] md:w-[130px] md:h-[130px] flex items-center justify-center z-20 pointer-events-none"
                 style="transform: rotateY(10deg) rotateX(-65deg); transform-style: preserve-3d;">
              
              <div class="absolute w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full filter blur-md animate-custom-sun-pulse z-10 bg-accent/25"></div>
              
              <div class="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-accent/40 shadow-[0_0_30px_rgba(246,107,21,0.3)] z-20 bg-zinc-950 flex items-center justify-center p-2 relative pointer-events-auto cursor-pointer group">
                <i class="fa-solid fa-brain text-xl md:text-2xl text-accent animate-pulse"></i>
              </div>

              <div class="absolute w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full border border-dashed border-accent/20 animate-custom-spin-cw pointer-events-none"></div>
              <div class="absolute w-[150px] h-[150px] md:w-[185px] md:h-[185px] rounded-full border border-dashed border-accent/10 animate-custom-spin-ccw pointer-events-none"></div>
            </div>

            <!-- Orbit Dust Particles -->
            ${this.dustItems.map(dust => `
              <div class="absolute left-1/2 top-1/2 w-1 h-1 rounded-full opacity-40 pointer-events-none animate-custom-orbit"
                   style="background: ${dust.color}; box-shadow: 0 0 6px ${dust.color}; animation-delay: ${dust.delay}; animation-duration: 24s; --orbit-radius: ${dust.radius}; --orbit-duration: 24s;">
              </div>
            `).join('')}

            <!-- Concentric Orbits & Planets -->
            ${this.orbits.map(orbit => `
              <!-- Dashed Track Ring -->
              <div class="absolute rounded-full border border-dashed border-zinc-700/60 pointer-events-none"
                   style="width: calc(2 * ${orbit.radiusClass}); height: calc(2 * ${orbit.radiusClass}); box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.01), 0 0 25px rgba(255, 255, 255, 0.01); --orbit-radius: ${orbit.radiusClass};">
              </div>

              <!-- Planets revolving on this orbit -->
              ${orbit.items.map((item, idx, arr) => {
                const delayValue = -(orbit.speed / arr.length) * idx;
                const durationValue = orbit.speed;
                return `
                  <div class="absolute left-1/2 top-1/2 w-0 h-0 pointer-events-none animate-custom-orbit tech-planet-pivot"
                       data-tech-id="${item.id}"
                       style="animation-delay: ${delayValue}s; animation-duration: ${durationValue}s; --orbit-radius: ${orbit.radiusClass}; --orbit-duration: ${durationValue}s; --hover-color: ${item.color}; transform-style: preserve-3d;">
                    
                    <!-- Laser Connection to Center (shown on hover) -->
                    <div class="tech-laser absolute right-0 top-1/2 h-[1.5px] origin-right -translate-y-1/2 pointer-events-none transition-opacity duration-300 opacity-0 z-0"
                         style="width: ${orbit.radiusClass}; background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.15) 20%, ${item.color} 80%, ${item.color} 100%); box-shadow: 0 0 8px ${item.color}, 0 0 16px ${item.color}40;">
                    </div>

                    <!-- Planet Card with Billboard Counter-Rotation -->
                    <div class="orbit-logo-card animate-custom-billboard tech-planet-card pointer-events-auto"
                         data-tech-id="${item.id}"
                         style="animation-delay: ${delayValue}s; animation-duration: ${durationValue}s; --orbit-duration: ${durationValue}s;">
                      <div class="planet-icon transition-transform duration-300" style="color: ${item.color};">
                        ${item.icon}
                      </div>
                      <span class="text-[11px] md:text-[13px] tracking-tight font-medium text-white">${item.label}</span>
                    </div>

                  </div>
                `;
              }).join('')}
            `).join('')}

          </div>
        </div>
      </section>
    `;
  }

  setup() {
    const techOrbitSec = document.getElementById('tech-orbit');
    if (!techOrbitSec) return;

    // Hover interaction: Pause or highlight planet and reveal laser beam
    const cards = techOrbitSec.querySelectorAll('.tech-planet-card');
    cards.forEach(card => {
      const id = card.getAttribute('data-tech-id');
      const pivot = techOrbitSec.querySelector(`.tech-planet-pivot[data-tech-id="${id}"]`);
      const laser = pivot ? pivot.querySelector('.tech-laser') : null;

      card.addEventListener('mouseenter', () => {
        if (laser) laser.style.opacity = '1';
        card.style.transform = 'translate(-50%, -50%) scale(1.12)';
        card.style.zIndex = '50';
      });

      card.addEventListener('mouseleave', () => {
        if (laser) laser.style.opacity = '0';
        card.style.transform = '';
        card.style.zIndex = '';
      });
    });
  }
}
