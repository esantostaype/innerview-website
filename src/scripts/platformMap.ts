import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SVG = 'http://www.w3.org/2000/svg';

/** Section 03: ResMan reports → Data Hub → the four areas. Lines are built from live layout. */
export function initPlatformMap(): (() => void) | void {
  const section = document.querySelector<HTMLElement>('[data-map]');
  if (!section) return;
  const stage = section.querySelector<HTMLElement>('[data-map-stage]')!;
  const svg = section.querySelector<SVGSVGElement>('[data-map-lines]')!;
  const core = section.querySelector<HTMLElement>('[data-map-core]')!;
  const sources = Array.from(section.querySelectorAll<HTMLElement>('[data-map-source]'));
  const areas = Array.from(section.querySelectorAll<HTMLElement>('[data-map-area]'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let drawTween: gsap.core.Tween | null = null;

  const build = () => {
    drawTween?.scrollTrigger?.kill();
    drawTween?.kill();
    svg.replaceChildren();
    if (window.innerWidth < 1024) return;

    const s = stage.getBoundingClientRect();
    const c = core.getBoundingClientRect();
    // Layout box, minus any in-flight entrance offset (data-anim="up" moves elements by y)
    const rel = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const dy = Number(gsap.getProperty(el, 'y')) || 0;
      return { l: r.left - s.left, r: r.right - s.left, cy: r.top - s.top + r.height / 2 - dy };
    };
    void c;
    const coreBox = rel(core);
    const paths: string[] = [];

    sources.forEach((el, i) => {
      const b = rel(el);
      const x1 = b.r;
      const x2 = coreBox.l;
      const y2 = coreBox.cy + (i - (sources.length - 1) / 2) * 10;
      const mx = (x1 + x2) / 2;
      paths.push(`M${x1} ${b.cy} C${mx} ${b.cy} ${mx} ${y2} ${x2} ${y2}`);
    });
    areas.forEach((el, i) => {
      const b = rel(el);
      const x1 = coreBox.r;
      const y1 = coreBox.cy + (i - (areas.length - 1) / 2) * 12;
      const x2 = b.l - 10;
      const mx = (x1 + x2) / 2;
      paths.push(`M${x1} ${y1} C${mx} ${y1} ${mx} ${b.cy} ${x2} ${b.cy}`);
    });

    const lines: SVGPathElement[] = [];
    paths.forEach((d, i) => {
      const line = document.createElementNS(SVG, 'path');
      line.setAttribute('d', d);
      line.setAttribute('class', 'map-line');
      line.setAttribute('pathLength', '1');
      svg.appendChild(line);
      lines.push(line);

      const pulse = document.createElementNS(SVG, 'path');
      pulse.setAttribute('d', d);
      pulse.setAttribute('class', 'map-pulse');
      pulse.setAttribute('pathLength', '400');
      pulse.style.animationDelay = `${(i * 0.37) % 3.2}s`;
      svg.appendChild(pulse);
    });

    if (reduced) {
      svg.classList.add('is-live');
      return;
    }
    gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
    drawTween = gsap.to(lines, {
      strokeDashoffset: 0,
      ease: 'none',
      stagger: 0.04,
      scrollTrigger: {
        trigger: stage,
        start: 'top 75%',
        end: 'center 50%',
        scrub: 0.8,
        onUpdate: (self) => svg.classList.toggle('is-live', self.progress > 0.95),
      },
    });
  };

  // Build after fonts/layout settle
  const ready = () => requestAnimationFrame(build);
  if (document.fonts?.status === 'loaded') ready();
  else document.fonts?.ready.then(ready);

  let timer: number | undefined;
  const onResize = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(build, 160);
  };
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    drawTween?.scrollTrigger?.kill();
    drawTween?.kill();
  };
}
