import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stages } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/** Fit fixed-size product UIs to their container with zoom (keeps text crisp). */
export function fitZoom(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-zoom-fit]').forEach((frame) => {
    const design = Number(frame.dataset.zoomFit);
    const inner = frame.firstElementChild as HTMLElement | null;
    if (!inner || !design) return;
    inner.style.zoom = String(frame.clientWidth / design);
  });
}

/** Offset of `el` inside `root`, in root's layout coordinates (ignores transforms). */
function offsetIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/* ------------------------------------------------------------------ Loops */
function analyzeLoop(ui: HTMLElement) {
  const row = ui.querySelector<HTMLElement>('[data-pl-row="utilities"]')!;
  const pop = ui.querySelector<HTMLElement>('[data-pl-pop]')!;
  const place = () => {
    const r = offsetIn(row, ui);
    pop.style.top = `${r.y + r.h + 6}px`;
    pop.style.left = `${Math.min(r.x + 210, ui.offsetWidth - pop.offsetWidth - 16)}px`;
  };
  place();
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true, onRepeat: place });
  tl.add(() => row.classList.add('is-hot'), 1.2)
    .to(pop, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, 1.5)
    .to(pop, { opacity: 0, y: 6, scale: 0.98, duration: 0.35, ease: 'power2.in' }, 5.2)
    .add(() => row.classList.remove('is-hot'), 5.4)
    .set({}, {}, 6.4);
  return tl;
}

function planLoop(ui: HTMLElement) {
  const vals = gsap.utils.toArray<HTMLElement>(ui.querySelectorAll('.bg-val'));
  const rows = Array.from(ui.querySelectorAll<HTMLElement>('.bg-row:not(.bg-th)'));
  const byCol = [0, 1, 2, 3].map((c) => rows.map((r) => r.querySelectorAll<HTMLElement>('.bg-val')[c]));
  const src = ui.querySelector<HTMLElement>('[data-bg-cell="rent-0"]')!;
  const tgt = ui.querySelector<HTMLElement>('[data-bg-cell="ltl-0"]')!;
  const svg = ui.querySelector<SVGSVGElement>('[data-bg-trace]')!;
  const path = ui.querySelector<SVGPathElement>('[data-bg-trace-path]')!;
  const eq = ui.querySelector<HTMLElement>('[data-bg-eq]')!;
  const elecRow = ui.querySelector<HTMLElement>('[data-bg-row="elec"]')!;
  const compare = ui.querySelector<HTMLElement>('[data-bg-compare]')!;
  const opt = ui.querySelector<HTMLElement>('[data-bg-opt]')!;

  const layoutTrace = () => {
    svg.setAttribute('viewBox', `0 0 ${ui.offsetWidth} ${ui.offsetHeight}`);
    const a = offsetIn(src, ui);
    const b = offsetIn(tgt, ui);
    const x1 = a.x + a.w - 8;
    const y1 = a.y + a.h / 2;
    const x2 = b.x + b.w - 8;
    const y2 = b.y + b.h / 2;
    path.setAttribute('d', `M${x1} ${y1} C${x1 + 34} ${y1} ${x2 + 34} ${y2} ${x2} ${y2}`);
    eq.style.left = `${b.x - 70}px`;
    eq.style.top = `${b.y + b.h + 8}px`;
    const e = offsetIn(elecRow, ui);
    compare.style.top = `${e.y + e.h + 6}px`;
  };
  layoutTrace();
  const len = 120;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true, onRepeat: layoutTrace });
  tl.set(vals, { opacity: 0, y: 6 }, 0);
  byCol.forEach((col, c) => {
    tl.to(col, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05 }, 0.4 + c * 0.45);
  });
  // Trace
  tl.add(() => {
    tgt.classList.add('is-target');
    src.classList.add('is-source');
  }, 3.2)
    .fromTo(path, { strokeDashoffset: len, strokeDasharray: `3 4` }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 3.25)
    .fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 3.25)
    .to(eq, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 3.5)
    .to([eq, svg], { opacity: 0, duration: 0.3 }, 5.6)
    .add(() => {
      tgt.classList.remove('is-target');
      src.classList.remove('is-source');
    }, 5.7)
    // Compare forecasts
    .add(() => elecRow.classList.add('is-focus'), 6.0)
    .to(compare, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, 6.1)
    .add(() => opt.classList.add('is-picked'), 7.4)
    .to(compare, { opacity: 0, y: 6, scale: 0.98, duration: 0.35, ease: 'power2.in' }, 9.0)
    .add(() => {
      opt.classList.remove('is-picked');
      elecRow.classList.remove('is-focus');
    }, 9.4)
    .to(vals, { opacity: 0.0, duration: 0.4, ease: 'power1.in' }, 10.2);
  return tl;
}

function operateLoop(ui: HTMLElement) {
  const segs = Array.from(ui.querySelectorAll<HTMLElement>('[data-op-seg]'));
  const label = ui.querySelector<HTMLElement>('[data-op-stage]')!;
  const count = ui.querySelector<HTMLElement>('[data-op-count]')!;
  const field = (k: string) => ui.querySelector<HTMLElement>(`[data-op-field="${k}"]`)!;
  const lineRows = Array.from(ui.querySelectorAll<HTMLElement>('[data-op-line]'));
  const col = (i: number) => lineRows.map((r) => r.querySelectorAll<HTMLElement>('.op-fill')[i]);
  const pending = ui.querySelector<HTMLElement>('.op-ready-pending')!;
  const done = ui.querySelector<HTMLElement>('.op-ready-done')!;
  const allFields = ['acct', 'addr', 'charges', 'total'].map(field);

  const setStage = (i: number) => {
    segs.forEach((s, k) => {
      s.classList.toggle('is-done', k < i);
      s.classList.toggle('is-now', k === i);
    });
    label.textContent = i >= stages.length ? 'Ready to post' : stages[i];
    count.textContent = i >= stages.length ? 'Complete' : `Stage ${i + 1} of ${stages.length}`;
  };

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
  tl.add(() => {
    setStage(0);
    allFields.forEach((f) => f.classList.remove('is-found'));
  }, 0)
    .set([col(0), col(1), col(2)], { opacity: 0 }, 0)
    .set(done, { opacity: 0 }, 0)
    .set(pending, { opacity: 1 }, 0);

  const step = 0.5;
  stages.forEach((_, i) => tl.add(() => setStage(i), 0.3 + i * step));
  tl.add(() => setStage(stages.length), 0.3 + stages.length * step);

  // Detecting vendor → account found
  tl.add(() => field('acct').classList.add('is-found'), 0.3 + 1 * step)
    // Matching addresses / units → property column
    .add(() => field('addr').classList.add('is-found'), 0.3 + 5 * step)
    .to(col(0), { opacity: 1, duration: 0.4, stagger: 0.08 }, 0.3 + 6 * step)
    // Resolving GL accounts
    .to(col(1), { opacity: 1, duration: 0.4, stagger: 0.08 }, 0.3 + 7 * step)
    // Reconciling totals
    .add(() => {
      field('charges').classList.add('is-found');
      field('total').classList.add('is-found');
    }, 0.3 + 8 * step)
    .to(col(2), { opacity: 1, duration: 0.4, stagger: 0.08 }, 0.3 + 8 * step)
    // Ready
    .to(pending, { opacity: 0, duration: 0.3 }, 0.3 + 11 * step)
    .to(done, { opacity: 1, duration: 0.4 }, 0.3 + 11 * step)
    .set({}, {}, 0.3 + 11 * step + 3.2);
  return tl;
}

/* ------------------------------------------------------------------ Section */
export function initAreas(): (() => void) | void {
  const section = document.querySelector<HTMLElement>('[data-areas]');
  if (!section) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  fitZoom(section);
  const onResize = () => {
    fitZoom(section);
    ScrollTrigger.refresh();
  };
  window.addEventListener('resize', onResize);

  if (reduced) {
    return () => window.removeEventListener('resize', onResize);
  }

  const mm = gsap.matchMedia();
  const loops: gsap.core.Timeline[] = [];

  const ctx = gsap.context(() => {
    const areas = gsap.utils.toArray<HTMLElement>('[data-area]');
    const builders: Record<string, (ui: HTMLElement) => gsap.core.Timeline> = {
      analyze: analyzeLoop,
      plan: planLoop,
      operate: operateLoop,
    };

    areas.forEach((area) => {
      const card = area.querySelector<HTMLElement>('[data-area-card]')!;
      const ui = area.querySelector<HTMLElement>('[data-ui]')!;
      const copy = area.querySelectorAll('.area-copy > *');

      // Entrance: copy staggers, UI rises with depth
      gsap.set(copy, { opacity: 0, y: 22 });
      gsap.set(ui.parentElement, { opacity: 0, y: 50, scale: 0.97 });
      ScrollTrigger.create({
        trigger: card,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          gsap.to(copy, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.07 });
          gsap.to(ui.parentElement, { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'expo.out', delay: 0.15 });
        },
      });

      // Product loop, only while visible
      const loop = builders[ui.dataset.ui ?? '']?.(ui);
      if (loop) {
        loops.push(loop);
        ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          end: 'bottom 10%',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
      }
    });

    // Stacking: as the next card arrives, the current one recedes
    mm.add('(min-width: 1024px)', () => {
      areas.forEach((area, i) => {
        const next = areas[i + 1];
        if (!next) return;
        const card = area.querySelector('[data-area-card]');
        const shade = area.querySelector('[data-area-shade]');
        gsap
          .timeline({
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: 0.6 },
            defaults: { ease: 'none' },
          })
          .to(card, { scale: 0.94, y: -8 }, 0)
          .to(shade, { opacity: 0.45 }, 0);
      });
    });
  }, section);

  const onVisibility = () => loops.forEach((l) => (document.hidden ? l.pause() : null));
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    loops.forEach((l) => l.kill());
    mm.revert();
    ctx.revert();
  };
}
