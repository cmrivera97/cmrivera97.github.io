import type { CarouselActiveDetail } from './carousel';

interface ProjectMeta {
  slug: string;
  studio: string;
  role: string;
  sectors: string;
  year: number;
}

const setEyebrow = (root: HTMLElement, label: string): void => {
  const slot = root.querySelector<HTMLElement>('[data-selected-category]');
  // eslint-disable-next-line no-param-reassign
  if (slot) slot.textContent = label;
};

const setMeta = (root: HTMLElement, project: ProjectMeta | undefined): void => {
  if (!project) return;
  const strip = root.querySelector<HTMLElement>('[data-meta-strip]');
  if (!strip) return;
  const set = (key: string, value: string): void => {
    const el = strip.querySelector<HTMLElement>(`[data-meta='${key}']`);
    // eslint-disable-next-line no-param-reassign
    if (el) el.textContent = value;
  };
  set('studio', project.studio);
  set('role', project.role);
  set('sectors', project.sectors);
  set('year', String(project.year));
};

const readProjects = (root: HTMLElement, categorySlug: string): ProjectMeta[] => {
  const blob = root.querySelector<HTMLScriptElement>(`[data-projects='${categorySlug}']`);
  if (!blob || !blob.textContent) return [];
  try {
    return JSON.parse(blob.textContent) as ProjectMeta[];
  } catch {
    return [];
  }
};

const filterShowcaseCards = (root: HTMLElement, categorySlug: string): void => {
  const showcases = root.querySelectorAll<HTMLElement>('[data-showcase-wrapper]');
  showcases.forEach((sc) => {
    // eslint-disable-next-line no-param-reassign
    sc.style.display = sc.dataset.category === categorySlug ? '' : 'none';
  });
};

export const initBubbleSelector = (root?: ParentNode): void => {
  if (typeof document === 'undefined') return;
  const sections = (root ?? document).querySelectorAll<HTMLElement>('[data-bubble-selector]');

  sections.forEach((section) => {
    const bubbles = section.querySelectorAll<HTMLButtonElement>('.portfolio-bubble');

    const activate = (categorySlug: string, label: string, blurb: string): void => {
      bubbles.forEach((b) => {
        b.setAttribute('aria-selected', b.dataset.category === categorySlug ? 'true' : 'false');
        b.classList.toggle('active', b.dataset.category === categorySlug);
      });
      filterShowcaseCards(section, categorySlug);
      setEyebrow(section, label);
      const blurbEl = section.querySelector<HTMLElement>('[data-selected-blurb]');
      if (blurbEl) blurbEl.textContent = blurb;
      const explore = section.querySelector<HTMLAnchorElement>('[data-explore]');
      if (explore) {
        const href = explore.getAttribute('href') ?? '';
        explore.setAttribute('href', href.replace(/[^/]+\/$/, `${categorySlug}/`));
        const exploreLabel = section.querySelector<HTMLElement>('[data-explore-label]');
        if (exploreLabel) exploreLabel.textContent = label;
      }
      const projects = readProjects(section, categorySlug);
      setMeta(section, projects[0]);
      window.dispatchEvent(new CustomEvent('bubble:change', { detail: { categorySlug } }));
    };

    bubbles.forEach((b) => {
      b.addEventListener('click', () => {
        const cat = b.dataset.category;
        const label = b.textContent?.trim() ?? '';
        const blurb = b.dataset.blurb ?? '';
        if (cat) activate(cat, label, blurb);
      });
    });

    bubbles.forEach((b, idx) => {
      b.addEventListener('keydown', (e: KeyboardEvent) => {
        let nextIdx = -1;
        if (e.key === 'ArrowRight') nextIdx = Math.min(bubbles.length - 1, idx + 1);
        else if (e.key === 'ArrowLeft') nextIdx = Math.max(0, idx - 1);
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = bubbles.length - 1;
        if (nextIdx === -1) return;
        e.preventDefault();
        const nextBubble = bubbles[nextIdx];
        if (!nextBubble) return;
        nextBubble.focus();
        const cat = nextBubble.dataset.category;
        const label = nextBubble.textContent?.trim() ?? '';
        const blurb = nextBubble.dataset.blurb ?? '';
        if (cat) activate(cat, label, blurb);
      });
    });

    window.addEventListener('carousel:active', (e: Event) => {
      const { detail } = e as CustomEvent<CarouselActiveDetail>;
      if (!detail) return;
      const activeBubble = section.querySelector<HTMLButtonElement>('.portfolio-bubble[aria-selected="true"]');
      const cat = activeBubble?.dataset.category;
      if (!cat) return;
      const projects = readProjects(section, cat);
      const found = projects.find((p) => p.slug === detail.slug);
      setMeta(section, found);
    });
  });
};
