import { initLiquidEther } from '../utils/liquidEther.js';

/**
 * Hero Component - 3D Character Hero Section for Raj Rathod.
 * Features:
 * - 100svh full-screen stage
 * - LiquidEther Three.js WebGL fluid shader background
 * - Svg_Stroke parallax layers (stroke-1 front, stroke-2 back)
 * - Monumental split-char "RAJ" heading (22vw)
 * - Centered 3D character cutout standing at bottom (bottom: -1px) with 100% solid, intact collar
 * - Natural 3D layered parallax depth motion on mouse move
 * - 6px bottom border end-line
 */
export class Hero {
  render() {
    return `
      <!-- Hero Section -->
      <div id="hero-section">
        <!-- Animated fluid background -->
        <div id="hero-bg-fluid"></div>

        <!-- Back stroke (behind heading) -->
        <div class="hero-layer" data-depth="0.20" style="z-index: 4;">
          <div id="hero-stroke-2">
            <img src="/Svg_Stroke.png" alt="" draggable="false" />
          </div>
        </div>

        <!-- Heading text (deepest, moves least in parallax) -->
        <div class="hero-layer" data-depth="0.10" style="z-index: 5;">
          <div id="hero-heading" class="hero-heading-flanked">
            <div class="hero-name-part hero-name-left" aria-label="Raj">
              <span class="hero-char" style="display: inline-block;">R</span>
              <span class="hero-char" style="display: inline-block;">A</span>
              <span class="hero-char" style="display: inline-block;">J</span>
            </div>
            <div class="hero-name-part hero-name-right" aria-label="Rathod">
              <span class="hero-char" style="display: inline-block;">R</span>
              <span class="hero-char" style="display: inline-block;">A</span>
              <span class="hero-char" style="display: inline-block;">T</span>
              <span class="hero-char" style="display: inline-block;">H</span>
              <span class="hero-char" style="display: inline-block;">O</span>
              <span class="hero-char" style="display: inline-block;">D</span>
            </div>
          </div>
        </div>

        <!-- Portrait image (foreground, moves with depth) -->
        <div class="hero-layer" data-depth="0.50" style="z-index: 10;">
          <div id="hero-img">
            <img id="raj-3d-character-img"
                 src="/assets/raj3d/bust_front.png"
                 alt="Raj Rathod - AI &amp; Machine Learning Engineer Portrait"
                 fetchpriority="high"
                 draggable="false" />
          </div>
        </div>

        <!-- Front stroke (top-most decoration) -->
        <div class="hero-layer" data-depth="0.30" style="z-index: 13;">
          <div id="hero-stroke-1">
            <img src="/Svg_Stroke.png" alt="" draggable="false" />
          </div>
        </div>

        <!-- End-of-hero indicator line -->
        <div class="hero-end-line"></div>
      </div>
    `;
  }

  setup() {
    const heroSection = document.getElementById('hero-section');
    const heroBgFluid = document.getElementById('hero-bg-fluid');

    // 1. Mount LiquidEther Three.js WebGL Fluid Shader
    const mountFluid = () => {
      if (heroBgFluid && window.THREE && !heroBgFluid.querySelector('canvas')) {
        try {
          const isDark = document.documentElement.dataset.theme === 'dark' || document.documentElement.classList.contains('dark');
          const fluidColors = isDark ? ['#38bdf8', '#0ea5e9'] : ['#D9E6FF'];
          initLiquidEther(heroBgFluid, {
            colors: fluidColors,
            mouseForce: 22,
            cursorSize: 110,
            isViscous: false,
            viscous: 30,
            iterationsViscous: 32,
            iterationsPoisson: 32,
            resolution: 0.55,
            autoDemo: true,
            autoSpeed: 0.5,
            autoIntensity: 2.2,
            takeoverDuration: 0.25,
            autoResumeDelay: 2500,
            autoRampDuration: 0.6
          });
        } catch (err) {
          console.warn('LiquidEther initialization notice:', err);
        }
      }
    };

    mountFluid();
    if (!window.THREE) {
      window.addEventListener('load', mountFluid, { once: true });
    }

    // 2. Parallax mouse tracking across layers & cursor blue glow positioning
    if (heroSection) {
      const layers = heroSection.querySelectorAll('.hero-layer');
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let rafId = null;

      const onHeroMouseMove = (e) => {
        const rect = heroSection.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        heroSection.style.setProperty('--hero-mouse-x', `${px}px`);
        heroSection.style.setProperty('--hero-mouse-y', `${py}px`);
        targetX = px / rect.width - 0.5; // -0.5 to 0.5
        targetY = py / rect.height - 0.5; // -0.5 to 0.5
      };

      const renderParallax = () => {
        // Smooth lerp
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        layers.forEach(layer => {
          const depth = parseFloat(layer.getAttribute('data-depth') || '0.2');
          const moveX = currentX * depth * 70;
          const moveY = currentY * depth * 45;
          layer.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
        });

        rafId = requestAnimationFrame(renderParallax);
      };

      heroSection.addEventListener('mousemove', onHeroMouseMove);
      heroSection.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
      });

      renderParallax();
    }

    // 3. Hero Entrance Reveal via GSAP (matching Pranay's cinematic intro)
    if (typeof gsap !== 'undefined' && heroSection) {
      const headingChars = heroSection.querySelectorAll('.hero-char');
      const heroImg = document.getElementById('hero-img');
      const stroke1 = document.getElementById('hero-stroke-1');
      const stroke2 = document.getElementById('hero-stroke-2');

      if (headingChars.length > 0) {
        gsap.fromTo(headingChars, 
          { autoAlpha: 0, y: 60 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.0, ease: 'power3.out', delay: 0.15 }
        );
      }
      if (heroImg) {
        gsap.fromTo(heroImg,
          { autoAlpha: 0, y: 40, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 }
        );
      }
      if (stroke1 && stroke2) {
        gsap.fromTo([stroke1, stroke2],
          { autoAlpha: 0, scale: 0.8 },
          { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out', delay: 0.45 }
        );
      }
    }
  }
}
