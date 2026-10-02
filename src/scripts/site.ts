import type LocomotiveScrollType from 'locomotive-scroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHero } from './hero';
import { initPatchwork } from './patchwork';
import { initOverlayScrollbars } from './scrollbars';
import { initReveal } from './reveal';
import { initPlatformMap } from './platformMap';
import { initAreas } from './areas';
import { initSections } from './sections';

type ThemePref = 'light' | 'dark' | 'system';
const THEME_KEY = 'iv-theme';

declare global {
  interface Window {
    __ivApplyTheme?: () => void;
    __ivScroll?: LocomotiveScrollType | null;
  }
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ Theme */
function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

function setPref(pref: ThemePref) {
  try {
    if (pref === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {
    /* storage unavailable: preference lasts for this page only */
  }
  const root = document.documentElement;
  root.classList.add('theme-switching');
  window.__ivApplyTheme?.();
  syncThemeControls();
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

function syncThemeControls() {
  const pref = readPref();
  document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach((btn) => {
    btn.setAttribute('aria-checked', String(btn.dataset.themeChoice === pref));
    btn.tabIndex = btn.dataset.themeChoice === pref ? 0 : -1;
  });
}

function bindThemeControls() {
  document.querySelectorAll<HTMLElement>('[data-theme-switcher]').forEach((group) => {
    const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-theme-choice]'));
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => setPref(btn.dataset.themeChoice as ThemePref));
      btn.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = buttons[(i + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length];
        next.focus();
        setPref(next.dataset.themeChoice as ThemePref);
      });
    });
  });
  syncThemeControls();
}

let systemListenerBound = false;
function bindSystemTheme() {
  if (systemListenerBound) return;
  systemListenerBound = true;
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (readPref() === 'system') window.__ivApplyTheme?.();
  });
}

/* ------------------------------------------------------------------ Scroll */
const SMOOTH_SCROLL_MEDIA = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

function scrollsOnItsOwn(node: HTMLElement): boolean {
  if (node === document.documentElement || node === document.body) return false;
  const style = getComputedStyle(node);
  const scrollsY = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1;
  const scrollsX = (style.overflowX === 'auto' || style.overflowX === 'scroll') && node.scrollWidth > node.clientWidth + 1;
  return scrollsY || scrollsX;
}
async function initScroll() {
  const root = document.documentElement;
  if (reducedMotion()) {
    root.classList.remove('motion-ready');
    return;
  }
  root.classList.add('motion-ready');
  // Same smooth scrolling as the InnerView app (components/scroll/use-smooth-scroll.ts):
  // desktop with a fine pointer only; touch keeps native momentum; nested scrollers stay native.
  if (!window.matchMedia(SMOOTH_SCROLL_MEDIA).matches) return;
  const { default: LocomotiveScroll } = await import('locomotive-scroll');
  window.__ivScroll = new LocomotiveScroll({
    lenisOptions: {
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -72 },
      prevent: (node: HTMLElement) => scrollsOnItsOwn(node),
    },
    triggerRootMargin: '-8% 0px -8% 0px',
    // Keep GSAP ScrollTrigger in sync with the smoothed scroll position
    scrollCallback: () => ScrollTrigger.update(),
  });
  ScrollTrigger.refresh();
}

function destroyScroll() {
  window.__ivScroll?.destroy();
  window.__ivScroll = null;
}

/* ------------------------------------------------------------------ Header */
let headerCleanup: (() => void) | null = null;
function bindHeader() {
  headerCleanup?.();
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;
  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.getElementById('mobile-menu');
  const close = () => {
    toggle?.setAttribute('aria-expanded', 'false');
    panel?.setAttribute('data-open', 'false');
    document.documentElement.classList.remove('menu-open');
    window.__ivScroll?.start?.();
  };
  const onToggle = () => {
    const open = toggle?.getAttribute('aria-expanded') !== 'true';
    toggle?.setAttribute('aria-expanded', String(open));
    panel?.setAttribute('data-open', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) window.__ivScroll?.stop?.();
    else window.__ivScroll?.start?.();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      close();
      toggle?.focus();
    }
  };
  toggle?.addEventListener('click', onToggle);
  panel?.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', onKey);

  headerCleanup = () => {
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('keydown', onKey);
    close();
  };
}

/* ------------------------------------------------------------------ Stage ticker (hero) */
let tickerTimer: number | undefined;
function bindStageTicker() {
  window.clearInterval(tickerTimer);
  const el = document.querySelector<HTMLElement>('[data-stage-ticker]');
  if (!el) return;
  const stages = JSON.parse(el.dataset.stages ?? '[]') as string[];
  const label = el.querySelector<HTMLElement>('[data-stage-label]');
  const count = el.querySelector<HTMLElement>('[data-stage-count]');
  const bar = el.querySelector<HTMLElement>('[data-stage-bar]');
  if (!label || stages.length === 0) return;
  let i = 0;
  const render = () => {
    label.textContent = stages[i];
    if (count) count.textContent = `${String(i + 1).padStart(2, '0')} / ${stages.length}`;
    if (bar) bar.style.transform = `scaleX(${(i + 1) / stages.length})`;
  };
  render();
  if (reducedMotion()) return;
  tickerTimer = window.setInterval(() => {
    if (document.hidden) return;
    i = (i + 1) % stages.length;
    label.animate(
      [
        { opacity: 0, transform: 'translateY(6px)', filter: 'blur(2px)' },
        { opacity: 1, transform: 'none', filter: 'blur(0)' },
      ],
      { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
    render();
  }, 1700);
}

/* ------------------------------------------------------------------ Sticky workflow story */
let workflowObserver: IntersectionObserver | null = null;
function bindWorkflow() {
  workflowObserver?.disconnect();
  const scene = document.querySelector<HTMLElement>('[data-workflow]');
  if (!scene) return;
  const steps = Array.from(scene.querySelectorAll<HTMLElement>('[data-step]'));
  // Below desktop the panel sits above the steps, so it shows the finished state.
  if (!window.matchMedia('(min-width: 1024px)').matches) {
    scene.dataset.activeStep = String(steps.length - 1);
    return;
  }
  workflowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const step = (entry.target as HTMLElement).dataset.step ?? '0';
        scene.dataset.activeStep = step;
        steps.forEach((s) => s.toggleAttribute('data-current', s.dataset.step === step));
      });
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  steps.forEach((s) => workflowObserver?.observe(s));
}

/* ------------------------------------------------------------------ Demo form */
function bindDemoForm() {
  const form = document.querySelector<HTMLFormElement>('[data-demo-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  form.addEventListener('submit', async (e) => {
    if (!form.checkValidity()) return;
    e.preventDefault();
    const action = form.getAttribute('action');
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!action) {
      if (status) {
        status.dataset.tone = 'error';
        status.textContent =
          'Demo requests are not connected yet. Set PUBLIC_DEMO_FORM_ACTION to your form endpoint before launch.';
      }
      return;
    }
    submit?.setAttribute('aria-busy', 'true');
    if (submit) submit.disabled = true;
    try {
      const res = await fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.dataset.state = 'sent';
      if (status) {
        status.dataset.tone = 'ok';
        status.textContent = 'Thanks. We will reply to your work email to schedule the demo.';
      }
      form.reset();
    } catch {
      if (status) {
        status.dataset.tone = 'error';
        status.textContent = 'We could not send your request. Check your connection and try again.';
      }
    } finally {
      submit?.removeAttribute('aria-busy');
      if (submit) submit.disabled = false;
    }
  });
}

/* ------------------------------------------------------------------ Lifecycle */
export function initSite() {
  bindSystemTheme();

  let cleanups: Array<() => void> = [];

  document.addEventListener('astro:page-load', () => {
    cleanups = [
      initReveal(),
      initHero(),
      initPatchwork(),
      initPlatformMap(),
      initAreas(),
      initSections(),
      initOverlayScrollbars(),
    ].filter((c): c is () => void => typeof c === 'function');
    bindThemeControls();
    bindHeader();
    bindStageTicker();
    bindWorkflow();
    bindDemoForm();
    void initScroll();
  });

  document.addEventListener('astro:before-swap', () => {
    cleanups.forEach((c) => c());
    cleanups = [];
    destroyScroll();
    window.clearInterval(tickerTimer);
    workflowObserver?.disconnect();
    headerCleanup?.();
  });
}
