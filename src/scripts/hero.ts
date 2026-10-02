import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ Sample data */
type Period = 'month' | 'quarter';

const KPI: Record<Period, Record<string, { value: number; fmt: (n: number) => string; delta: string; note?: string }>> = {
  month: {
    noi: { value: 1.24, fmt: (n) => `$${n.toFixed(2)}M`, delta: '+4.2%', note: 'vs budget · Sep 2026' },
    occ: { value: 94.6, fmt: (n) => `${n.toFixed(1)}%`, delta: '+0.8 pts' },
    inv: { value: 1284, fmt: (n) => Math.round(n).toLocaleString('en-US'), delta: '96% auto-coded', note: 'Email and uploads · Sep' },
  },
  quarter: {
    noi: { value: 3.71, fmt: (n) => `$${n.toFixed(2)}M`, delta: '+3.6%', note: 'vs budget · Q3 2026' },
    occ: { value: 94.9, fmt: (n) => `${n.toFixed(1)}%`, delta: '+0.5 pts' },
    inv: { value: 3912, fmt: (n) => Math.round(n).toLocaleString('en-US'), delta: '95% auto-coded', note: 'Email and uploads · Q3' },
  },
};

// NOI in $K. Actual Jan–Sep, forecast Sep–Dec, budget all year.
const SERIES: Record<Period, { actual: number[]; forecast: number[]; budget: number[]; sub: string }> = {
  month: {
    actual: [1162, 1178, 1171, 1196, 1204, 1199, 1221, 1215, 1240],
    forecast: [1240, 1246, 1255, 1262],
    budget: [1180, 1184, 1188, 1192, 1196, 1200, 1205, 1210, 1214, 1218, 1222, 1226],
    sub: 'Net operating income by month · FY 2026',
  },
  quarter: {
    actual: [1170, 1170, 1170, 1200, 1200, 1200, 1225, 1225, 1225],
    forecast: [1225, 1254, 1254, 1254],
    budget: [1184, 1184, 1184, 1196, 1196, 1196, 1210, 1210, 1210, 1222, 1222, 1222],
    sub: 'Net operating income by quarter · FY 2026',
  },
};

const W = 560;
const H = 210;
const MIN = 1140;
const MAX = 1280;
const xAt = (i: number) => (i * W) / 11;
const yAt = (v: number) => 200 - ((v - MIN) / (MAX - MIN)) * 180;

function smoothPath(points: [number, number][]) {
  if (points.length < 2) return '';
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  const t = 0.18;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) * t;
    const c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t;
    const c2y = p2[1] - (p3[1] - p1[1]) * t;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/* ------------------------------------------------------------------ Hero */
export function initHero(): (() => void) | void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const pd = hero.querySelector<HTMLElement>('[data-pd]')!;
  const frame = hero.querySelector<HTMLElement>('[data-hero-frame]')!;
  const stage = hero.querySelector<HTMLElement>('[data-hero-stage]')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const q = <T extends Element = HTMLElement>(sel: string) => pd.querySelector<T>(sel)!;
  const qa = <T extends Element = HTMLElement>(sel: string) => Array.from(pd.querySelectorAll<T>(sel));

  /* -------- Fit the fixed-size product into its container */
  let scale = 1;
  const fit = () => {
    const w = stage.clientWidth;
    const compact = w < 720;
    pd.toggleAttribute('data-compact', compact);
    const designW = compact ? 560 : 1240;
    const designH = compact ? 900 : 760;
    scale = w / designW;
    // zoom re-lays out text at its real size (crisp); transform: scale would stretch a bitmap
    pd.style.zoom = String(scale);
    const visibleH = compact ? 640 : designH;
    frame.style.height = `${visibleH * scale}px`;
  };
  fit();

  /* -------- Chart state */
  const actualEl = q<SVGPathElement>('[data-pd-actual]');
  const forecastEl = q<SVGPathElement>('[data-pd-forecast]');
  const budgetEl = q<SVGPathElement>('[data-pd-budget]');
  const areaEl = q<SVGPathElement>('[data-pd-area]');
  const dotEl = q<SVGCircleElement>('[data-pd-dot]');
  const chartSub = q('[data-pd-chart-sub]');

  const chart = {
    actual: [...SERIES.month.actual],
    forecast: [...SERIES.month.forecast],
    budget: [...SERIES.month.budget],
  };
  const renderChart = () => {
    const a = chart.actual.map((v, i) => [xAt(i), yAt(v)] as [number, number]);
    const f = chart.forecast.map((v, i) => [xAt(i + 8), yAt(v)] as [number, number]);
    const b = chart.budget.map((v, i) => [xAt(i), yAt(v)] as [number, number]);
    const aPath = smoothPath(a);
    actualEl.setAttribute('d', aPath);
    forecastEl.setAttribute('d', smoothPath(f));
    budgetEl.setAttribute('d', smoothPath(b));
    areaEl.setAttribute('d', `${aPath} L${a[a.length - 1][0].toFixed(1)} ${H} L0 ${H} Z`);
    dotEl.setAttribute('cx', a[a.length - 1][0].toFixed(1));
    dotEl.setAttribute('cy', a[a.length - 1][1].toFixed(1));
  };
  renderChart();

  /* -------- KPI state */
  const KPI_KEYS = ['noi', 'occ', 'inv'] as const;
  const kpiState: Record<string, number> = { noi: KPI.month.noi.value, occ: KPI.month.occ.value, inv: KPI.month.inv.value };
  const renderKpis = (period: Period) => {
    for (const key of KPI_KEYS) {
      q(`[data-pd-kpi="${key}"]`).textContent = KPI[period][key].fmt(kpiState[key]);
    }
  };
  const setKpiText = (period: Period) => {
    for (const key of KPI_KEYS) {
      const d = q(`[data-pd-kpi-delta="${key}"] span`);
      d.textContent = KPI[period][key].delta;
      const note = KPI[period][key].note;
      if (note) q(`[data-pd-kpi-note="${key}"]`).textContent = note;
    }
    chartSub.textContent = SERIES[period].sub;
  };

  const ctx = gsap.context(() => {}, hero);
  const mm = gsap.matchMedia();
  let loop: gsap.core.Timeline | null = null;

  /* -------- Position helper (layout coords inside the product, unaffected by transforms) */
  const posOf = (el: HTMLElement, ox = 0.5, oy = 0.5) => {
    let x = 0;
    let y = 0;
    let n: HTMLElement | null = el;
    while (n && n !== pd) {
      x += n.offsetLeft;
      y += n.offsetTop;
      n = n.offsetParent as HTMLElement | null;
    }
    return { x: x + el.offsetWidth * ox, y: y + el.offsetHeight * oy };
  };

  /* -------- Period switch (segmented control + KPIs + chart) */
  const pill = q('[data-pd-seg-pill]');
  const segBtns = qa('[data-pd-period]');
  const switchPeriod = (tl: gsap.core.Timeline, to: Period, at: string | number) => {
    const btn = segBtns.find((b) => b.dataset.pdPeriod === to)!;
    tl.to(pill, { x: btn.offsetLeft - 2, duration: 0.45, ease: 'power3.out' }, at);
    tl.add(() => {
      segBtns.forEach((b) => b.classList.toggle('is-on', b === btn));
      setKpiText(to);
    }, at);
    tl.to(
      kpiState,
      {
        noi: KPI[to].noi.value,
        occ: KPI[to].occ.value,
        inv: KPI[to].inv.value,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => renderKpis(to),
      },
      at,
    );
    tl.to(chart.actual, { endArray: SERIES[to].actual, duration: 0.9, ease: 'power3.inOut', onUpdate: renderChart }, at);
    tl.to(chart.forecast, { endArray: SERIES[to].forecast, duration: 0.9, ease: 'power3.inOut' }, at);
    tl.to(chart.budget, { endArray: SERIES[to].budget, duration: 0.9, ease: 'power3.inOut' }, at);
  };

  /* -------- Autonomous loop: a controller using the workspace */
  const buildLoop = () => {
    loop?.kill();
    const cursor = q('[data-pd-cursor]');
    const click = q('[data-pd-click]');
    const drawer = q('[data-pd-drawer]');
    const row = q('[data-pd-row="riverbend"]');
    const close = q('[data-pd-close]');
    const quarterBtn = segBtns.find((b) => b.dataset.pdPeriod === 'quarter')!;
    const monthBtn = segBtns.find((b) => b.dataset.pdPeriod === 'month')!;
    const drawerItems = qa('[data-pd-d]');
    const miniBars = qa('.pd-mini-bar i');
    const compact = pd.hasAttribute('data-compact');
    const pdW = compact ? 560 : 1240;

    const home = { x: pdW * 0.62, y: compact ? 520 : 640 };
    const pQuarter = posOf(quarterBtn);
    const pMonth = posOf(monthBtn);
    const pRow = posOf(row, 0.32, 0.5);
    const pClose = posOf(close);

    gsap.set(cursor, { x: home.x, y: home.y, opacity: 0 });

    const press = (tl: gsap.core.Timeline, at: string | number) => {
      tl.to(cursor, { scale: 0.86, duration: 0.09, ease: 'power2.in' }, at);
      tl.to(cursor, { scale: 1, duration: 0.22, ease: 'power2.out' }, `>`);
      tl.fromTo(click, { opacity: 0.55, scale: 0.2 }, { opacity: 0, scale: 1.6, duration: 0.55, ease: 'power2.out' }, at);
    };
    const move = (tl: gsap.core.Timeline, p: { x: number; y: number }, duration: number, at?: string | number) =>
      tl.to(cursor, { x: p.x, y: p.y, duration, ease: 'power2.inOut' }, at);

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });

    // 1. Cursor arrives and switches the overview to Quarter
    tl.to(cursor, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 0.2);
    move(tl, pQuarter, 1.3, 0.3);
    press(tl, 1.65);
    switchPeriod(tl, 'quarter', 1.72);

    // 2. Opens Riverbend Flats from the properties table
    move(tl, pRow, 1.25, 3.7);
    tl.add(() => row.classList.add('is-hover'), 4.6);
    press(tl, 5.05);
    tl.add(() => {
      row.classList.remove('is-hover');
      row.classList.add('is-selected');
    }, 5.1);
    tl.to(drawer, { x: '0%', duration: 0.75, ease: 'expo.out' }, 5.15);
    tl.fromTo(drawerItems, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, 5.3);
    tl.fromTo(miniBars, { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, 5.5);

    // 3. Reads it, then closes the drawer
    move(tl, { x: pClose.x - 120, y: pClose.y + 210 }, 1.4, 6.3);
    move(tl, pClose, 1.0, 8.4);
    tl.add(() => close.classList.add('is-hover'), 9.1);
    press(tl, 9.4);
    tl.add(() => {
      close.classList.remove('is-hover');
      row.classList.remove('is-selected');
    }, 9.45);
    tl.to(drawer, { x: '105%', duration: 0.6, ease: 'power3.in' }, 9.45);

    // 4. Back to Month, so the loop ends where it started
    move(tl, pMonth, 1.1, 10.2);
    press(tl, 11.35);
    switchPeriod(tl, 'month', 11.42);
    move(tl, home, 1.4, 12.2);
    tl.to(cursor, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 12.9);

    loop = tl;
    return tl;
  };

  /* -------- Reduced motion: static, complete, no loop */
  if (reduced) {
    hero.classList.add('is-played');
    return () => {
      mm.revert();
      ctx.revert();
    };
  }

  ctx.add(() => {
    const lines = hero.querySelectorAll('[data-hero-line]');
    const sub = hero.querySelector('[data-hero-sub]');
    const ctas = hero.querySelectorAll('[data-hero-cta]');
    const metas = hero.querySelectorAll('[data-hero-meta]');
    const enter = hero.querySelector('[data-hero-enter]');
    const sideItems = pd.querySelectorAll('[data-pd-in="side"]');
    const topbar = pd.querySelectorAll('[data-pd-in="top"], [data-pd-in="head"]');
    const cards = pd.querySelectorAll('[data-pd-in="card"]');
    const rows = pd.querySelectorAll('[data-pd-in="row"]');

    gsap.set(lines, { yPercent: 110, opacity: 1 });
    gsap.set(sub, { opacity: 0, y: 14, filter: 'blur(6px)' });
    gsap.set(ctas, { opacity: 0, y: 10 });
    gsap.set(metas, { opacity: 0 });
    gsap.set(enter, { opacity: 0, y: 90, scale: 0.96, rotateX: 10 });
    gsap.set([sideItems, topbar, cards, rows], { opacity: 0 });
    hero.classList.add('is-played');

    const lineLen = actualEl.getTotalLength();
    gsap.set(actualEl, { strokeDasharray: lineLen, strokeDashoffset: lineLen });
    gsap.set([areaEl, forecastEl, budgetEl, dotEl], { opacity: 0 });

    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
      .to(lines, { yPercent: 0, duration: 1.05, stagger: 0.085 }, 0.1)
      .to(sub, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' }, 0.42)
      .to(ctas, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.62)
      .to(metas, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.85)
      .to(enter, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, 0.55)
      .fromTo(sideItems, { x: -8 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' }, 1.0)
      .fromTo(topbar, { y: -6 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 1.05)
      .fromTo(cards, { y: 14 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, 1.15)
      .fromTo(rows, { x: 10 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, 1.45)
      .to(actualEl, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 1.4)
      .to([budgetEl, areaEl], { opacity: 1, duration: 0.8, ease: 'power1.out' }, 1.8)
      .to([forecastEl, dotEl], { opacity: 1, duration: 0.6, ease: 'power1.out' }, 2.5)
      .add(() => {
        gsap.set(actualEl, { clearProps: 'strokeDasharray,strokeDashoffset' });
        buildLoop();
        if (ScrollTrigger.isInViewport(stage, 0.1)) loop?.play();
      }, 3.0);

    /* -------- Scroll choreography (mezpay-like: layers at different speeds) */
    mm.add(
      {
        desktop: '(min-width: 768px)',
        mobile: '(max-width: 767px)',
      },
      (c) => {
        const { desktop } = c.conditions as { desktop: boolean };
        const tilt = hero.querySelector('[data-hero-tilt]');
        gsap.set(tilt, { rotateX: desktop ? 16 : 7, scale: desktop ? 0.94 : 0.97 });

        gsap
          .timeline({
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
            defaults: { ease: 'none' },
          })
          .to(tilt, { rotateX: 0, scale: 1, y: desktop ? -40 : -16 }, 0)
          .to('[data-hero-copy]', { y: desktop ? -110 : -50, opacity: 0.15 }, 0)
          .to('[data-hero-glow]', { y: desktop ? -160 : -60, scale: 1.12 }, 0)
          .to('[data-hero-glow-b]', { y: desktop ? 120 : 40 }, 0);
      },
    );

    /* Pause the loop when the product is off screen */
    ScrollTrigger.create({
      trigger: stage,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        if (!loop) return;
        if (self.isActive) loop.play();
        else loop.pause();
      },
    });
  });

  /* Re-fit and rebuild the loop on resize (layout coords change) */
  let resizeTimer: number | undefined;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      fit();
      if (loop) {
        const playing = !loop.paused();
        // reset state to the loop's start before rebuilding
        loop.progress(0).kill();
        gsap.set(q('[data-pd-drawer]'), { x: '105%' });
        q('[data-pd-row="riverbend"]').classList.remove('is-selected', 'is-hover');
        buildLoop();
        if (playing) loop?.play();
      }
      ScrollTrigger.refresh();
    }, 180);
  };
  window.addEventListener('resize', onResize);

  const onVisibility = () => {
    if (!loop) return;
    if (document.hidden) loop.pause();
    else if (ScrollTrigger.isInViewport(stage, 0.1)) loop.play();
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    loop?.kill();
    mm.revert();
    ctx.revert();
  };
}
