import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 02 — the month-end patchwork.
 * 1. The statement lights up word by word as it crosses the viewport (scrubbed).
 * 2. Four fragments enter once, then drift at different depths while scrolling.
 * 3. A dashed thread "stitches" them together, ending at the closing line.
 */
export function initPatchwork(): (() => void) | void {
  const section = document.querySelector<HTMLElement>('[data-patch]');
  if (!section) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mm = gsap.matchMedia();

  const ctx = gsap.context(() => {
    const words = gsap.utils.toArray<HTMLElement>('[data-patch-statement] .word');
    const frags = gsap.utils.toArray<HTMLElement>('[data-frag]');
    const threadSvg = section.querySelector<SVGSVGElement>('[data-patch-thread-svg]');
    const close = section.querySelector('[data-patch-close]');
    const stage = section.querySelector('[data-patch-stage]');

    /* 1 · Statement: dim → full, word by word */
    gsap.set(words, { opacity: 0.16 });
    gsap.to(words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '[data-patch-statement]',
        start: 'top 82%',
        end: 'bottom 42%',
        scrub: 0.6,
      },
    });

    /* 2 · Fragments: a one-time entrance with depth */
    frags.forEach((f) => gsap.set(f, { rotation: Number(f.dataset.rot ?? 0) }));
    gsap.set(frags, { opacity: 0, yPercent: 14, scale: 0.96, filter: 'blur(4px)' });
    ScrollTrigger.create({
      trigger: stage,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(frags, {
          opacity: 1,
          yPercent: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.3,
          ease: 'expo.out',
          stagger: { each: 0.12, from: 'start' },
          clearProps: 'filter',
        });
      },
    });

    gsap.set(close, { opacity: 0, y: 24 });
    gsap.to(close, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: close, start: 'top 88%', once: true },
    });

    /* Glow drifts slower than the content */
    gsap.to('[data-patch-glow]', {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    mm.add({ desktop: '(min-width: 640px)', mobile: '(max-width: 639px)' }, (c) => {
      const { desktop } = c.conditions as { desktop: boolean };
      const range = desktop ? 90 : 8;

      /* Parallax: each fragment moves by its own depth; rotations settle as they pass */
      frags.forEach((frag) => {
        const depth = Number(frag.dataset.depth ?? 1);
        const rot = Number(frag.dataset.rot ?? 0);
        gsap.fromTo(
          frag,
          { y: range * depth, rotation: rot },
          {
            y: -range * depth,
            rotation: rot * 0.25,
            ease: 'none',
            scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 0.9 },
            immediateRender: false,
          },
        );
      });

      /* Thread: drawn as the stage scrolls through */
      if (desktop && threadSvg) {
        gsap.fromTo(
          threadSvg,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: { trigger: stage, start: 'top 70%', end: 'bottom 55%', scrub: 0.8 },
          },
        );
      }
    });
  }, section);

  return () => {
    mm.revert();
    ctx.revert();
  };
}
