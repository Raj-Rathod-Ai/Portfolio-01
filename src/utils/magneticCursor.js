/**
 * Magnetic Fluid Cursor & Interactive Aura Engine (Awwwards Style)
 * Provides smooth spring interpolation, trailing light halo, and magnetic attraction on interactive targets.
 */

export function initMagneticCursor() {
  // Disable on touch / mobile devices for performance and native feel
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
    return;
  }

  // Prevent duplicate mounts
  if (document.getElementById('awwwards-cursor-dot')) return;

  const dot = document.createElement('div');
  dot.id = 'awwwards-cursor-dot';
  dot.className = 'fixed pointer-events-none z-[999999] rounded-full transition-transform duration-75 ease-out';
  dot.style.cssText = `
    width: 8px;
    height: 8px;
    background: #ffffff;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    will-change: transform, left, top;
    left: -100px;
    top: -100px;
  `;

  const ring = document.createElement('div');
  ring.id = 'awwwards-cursor-ring';
  ring.className = 'fixed pointer-events-none z-[999998] rounded-full border border-white/40 transition-all duration-300 ease-out';
  ring.style.cssText = `
    width: 36px;
    height: 36px;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    will-change: transform, left, top, width, height, background;
    left: -100px;
    top: -100px;
  `;

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovered = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Smooth lerp loop for the trailing ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover detection for interactive elements
  const hoverSelectors = 'a, button, input, textarea, select, .flip-card, .nav-item, .cat-pill, [data-interactive]';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target && !isHovered) {
      isHovered = true;
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.background = 'rgba(255, 255, 255, 0.12)';
      ring.style.borderColor = 'rgba(255, 255, 255, 0.8)';
      dot.style.transform = 'translate(-50%, -50%) scale(1.6)';
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target && isHovered) {
      isHovered = false;
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.background = 'transparent';
      ring.style.borderColor = 'rgba(255, 255, 255, 0.4)';
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }, { passive: true });

  // Mouse leave window guard
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
