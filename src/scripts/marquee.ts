export const initMarquee = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;

  (root ?? document).querySelectorAll<HTMLElement>('[data-marquee-track]').forEach((track) => {
    if (track.dataset.marqueeHydrated === 'true') return;

    const originals = Array.from(track.children) as HTMLElement[];
    if (originals.length === 0) return;

    // Width of one copy of the items, and the strip's visible width.
    const baseWidth = track.scrollWidth;
    const containerWidth = track.parentElement?.clientWidth ?? baseWidth;

    // The animation translates the track by -50% of its own width, so the strip must be
    // exactly two identical "units". Each unit is the item set repeated enough times to span
    // the viewport — otherwise a short list leaves an empty gap before the loop seam.
    const MAX_UNIT_COPIES = 12; // guard against a runaway loop if widths read as ~0
    const unitCopies = Math.min(
      MAX_UNIT_COPIES,
      Math.max(1, Math.ceil(containerWidth / Math.max(baseWidth, 1))),
    );
    const totalCopies = unitCopies * 2;

    // One copy already lives in the DOM; append the rest to reach `totalCopies`.
    for (let copy = 1; copy < totalCopies; copy += 1) {
      originals.forEach((item) => {
        const clone = item.cloneNode(true) as HTMLElement;
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }

    // eslint-disable-next-line no-param-reassign
    track.dataset.marqueeHydrated = 'true';
  });
};
