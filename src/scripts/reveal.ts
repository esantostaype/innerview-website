import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared scroll motion for content sections (GSAP, works with or without smooth scroll).
 *
 *   data-anim="up"     rises 28px and fades in
 *   data-anim="fade"   fades in
 *   data-anim="clip"   media unmasks from the bottom
 *   data-anim="lines"  headline lines rise from their masks (.split-line > span)
 *   data-anim-delay    extra delay in ms
 *   data-speed="0.1"   parallax: moves by speed × 100% of a viewport-relative distance
 *
 * Elements in the same batch get a short stagger, so groups enter as one gesture.
 */
export function initReveal(): (() => void) | void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    const delayOf = (el: Element) => Number((el as HTMLElement).dataset.animDelay ?? 0) / 1000;

    const ups = gsap.utils.toArray<HTMLElement>('[data-anim="up"]');
    gsap.set(ups, { opacity: 0, y: 28 });
    ScrollTrigger.batch(ups, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        batch.forEach((el, i) =>
          gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: i * 0.08 + delayOf(el) }),
        ),
    });

    const fades = gsap.utils.toArray<HTMLElement>('[data-anim="fade"]');
    gsap.set(fades, { opacity: 0 });
    ScrollTrigger.batch(fades, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        batch.forEach((el, i) => gsap.to(el, { opacity: 1, duration: 1, ease: 'power2.out', delay: i * 0.06 + delayOf(el) })),
    });

    gsap.utils.toArray<HTMLElement>('[data-anim="clip"]').forEach((el) => {
      gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
      gsap.to(el, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.4,
        ease: 'expo.out',
        delay: delayOf(el),
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-anim="lines"]').forEach((el) => {
      const lines = el.querySelectorAll('.split-line > span');
      gsap.set(lines, { yPercent: 108 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.09,
        delay: delayOf(el),
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });

    mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (c) => {
      const { desktop } = c.conditions as { desktop: boolean };
      gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
        const speed = Number(el.dataset.speed) * (desktop ? 1 : 0.4);
        gsap.fromTo(
          el,
          { yPercent: speed * 100 },
          {
            yPercent: -speed * 100,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    });
  });

  return () => {
    mm.revert();
    ctx.revert();
  };
}
