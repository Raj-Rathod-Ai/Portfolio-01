/**
 * 3D Specular Tilt Physics & Parallax Engine (Awwwards Style)
 * Calculates dynamic card rotation angles and casts specular lighting sheen.
 */

export function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
    return;
  }

  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.flip-card');
    if (!card) return;

    const isFlipped = card.classList.contains('is-flipped') || card.classList.contains('flipped');
    if (isFlipped) return;

    const inner = card.querySelector('.flip-card-inner');
    if (!inner) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    inner.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    inner.style.transition = 'transform 0.08s ease-out';
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.flip-card');
    if (!card) return;

    const related = e.relatedTarget ? e.relatedTarget.closest('.flip-card') : null;
    if (related === card) return;

    const inner = card.querySelector('.flip-card-inner');
    if (!inner) return;

    const isFlipped = card.classList.contains('is-flipped') || card.classList.contains('flipped');
    if (!isFlipped) {
      inner.style.transform = '';
      inner.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }, { passive: true });
}
