/**
 * Hero → first-projects one-scroll snap.
 *
 * CSS scroll-snap can ease you toward a section, but a single wheel tick only moves a few
 * pixels, so it can't jump a whole viewport at once. This intercepts the first deliberate
 * downward gesture while the hero is at the top and smoothly carries the page past the
 * marquee straight to the first projects section (#design). It only acts at the very top,
 * so the rest of the page scrolls normally. Theme-independent (works in light and dark).
 */
export const initHeroSnap = (): void => {
  if (typeof window === 'undefined') return;

  const hero = document.querySelector<HTMLElement>('.hero-stage');
  const target = document.querySelector<HTMLElement>('#design')
    ?? document.querySelector<HTMLElement>('.portfolio-section');
  if (!hero || !target) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animating = false;

  // True only while the hero still fills the viewport (page essentially at the top).
  const atTop = (): boolean => window.scrollY <= 8;

  const snapToProjects = (): void => {
    if (animating || !atTop()) return;
    animating = true;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    // Release once the smooth scroll has settled so normal scrolling resumes below the fold.
    window.setTimeout(() => { animating = false; }, reduced ? 60 : 720);
  };

  window.addEventListener('wheel', (e: WheelEvent) => {
    if (e.deltaY > 6 && atTop()) {
      e.preventDefault();
      snapToProjects();
    }
  }, { passive: false });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const downKeys = ['ArrowDown', 'PageDown', ' ', 'Spacebar'];
    if (downKeys.includes(e.key) && atTop() && document.activeElement === document.body) {
      e.preventDefault();
      snapToProjects();
    }
  });

  // Touch: a downward swipe from the very top jumps to the projects section too.
  let touchStartY = 0;
  window.addEventListener('touchstart', (e: TouchEvent) => {
    touchStartY = e.touches[0]?.clientY ?? 0;
  }, { passive: true });
  window.addEventListener('touchmove', (e: TouchEvent) => {
    if (!atTop()) return;
    const dy = touchStartY - (e.touches[0]?.clientY ?? 0);
    if (dy > 24) snapToProjects();
  }, { passive: true });
};
