import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fitZoom } from './areas';

gsap.registerPlugin(ScrollTrigger);

/** Plays a loop only while its trigger is on screen. */
function whileVisible(trigger: Element, tl: gsap.core.Timeline) {
  ScrollTrigger.create({
    trigger,
    start: 'top 85%',
    end: 'bottom 10%',
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });
}

/* ------------------------------------------------------------------ Data Hub: a report lands, a release activates */
function hubLoop(ui: HTMLElement) {
  const row = ui.querySelector<HTMLElement>('[data-hub-new]')!;
  const s = (k: string) => ui.querySelector<HTMLElement>(`[data-s="${k}"]`)!;
  const relName = ui.querySelector<HTMLElement>('[data-hub-rel-name]')!;
  const relNote = ui.querySelector<HTMLElement>('[data-hub-rel-note]')!;
  const relChip = ui.querySelector<HTMLElement>('[data-hub-rel-chip]')!;
  const release = ui.querySelector<HTMLElement>('[data-hub-release]')!;

  const setRelease = (next: boolean) => {
    relName.textContent = next ? 'Release v2026.10.01' : 'Release v2026.09.28';
    relNote.textContent = next
      ? 'Active context · 5 datasets · activated now · reason: October close'
      : 'Active context · 5 datasets · activated Sep 28';
  };

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });
  tl.add(() => setRelease(false), 0)
    .set(row, { opacity: 0, y: -10, height: 0 }, 0)
    .set([s('queued'), s('merging'), s('merged')], { opacity: 0 }, 0)
    .to(row, { opacity: 1, y: 0, height: 38, duration: 0.6, ease: 'expo.out' }, 0.6)
    .to(s('queued'), { opacity: 1, duration: 0.25 }, 0.7)
    .to(s('queued'), { opacity: 0, duration: 0.2 }, 2.0)
    .to(s('merging'), { opacity: 1, duration: 0.25 }, 2.1)
    .to(s('merging'), { opacity: 0, duration: 0.2 }, 3.9)
    .to(s('merged'), { opacity: 1, duration: 0.25 }, 4.0)
    .to(release, { boxShadow: 'inset 0 0 0 1px var(--primary)', duration: 0.3 }, 4.8)
    .add(() => setRelease(true), 5.0)
    .fromTo(relChip, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 5.0)
    .to(release, { boxShadow: 'inset 0 0 0 1px var(--rule)', duration: 0.6 }, 6.2)
    .to(row, { opacity: 0, duration: 0.5 }, 8.6)
    .set({}, {}, 9.2);
  return tl;
}

/* ------------------------------------------------------------------ Audit log: new events arrive at the top */
function auditLoop(list: HTMLElement) {
  const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-audit-row]'));
  const rowH = 46;
  // Rows are absolutely positioned and cycled: the last one re-enters at the top as "just now".
  rows.forEach((r, i) => gsap.set(r, { position: 'absolute', left: 0, right: 0, top: 0, y: i * rowH }));
  let order = rows.slice();

  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.add(() => {
    const incoming = order[order.length - 1];
    const rest = order.slice(0, -1);
    order = [incoming, ...rest];
    gsap.set(incoming, { y: -rowH, opacity: 0 });
    incoming.classList.add('is-new');
    gsap.to(incoming, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' });
    rest.forEach((r, i) => gsap.to(r, { y: (i + 1) * rowH, duration: 0.7, ease: 'expo.out' }));
    rest.forEach((r) => r.classList.remove('is-new'));
    const when = incoming.querySelector<HTMLElement>('span:last-child');
    if (when) when.textContent = 'just now';
  }, 2.6).set({}, {}, 3.2);
  return tl;
}

/* ------------------------------------------------------------------ Assistant: a short conversation */
function chatLoop(ui: HTMLElement) {
  const u1 = ui.querySelector('[data-chat-user]');
  const a1 = ui.querySelector('[data-chat-ai]');
  const acts = ui.querySelector('[data-chat-actions]');
  const u2 = ui.querySelector('[data-chat-user2]');
  const a2 = ui.querySelector('[data-chat-ai2]');
  const all = [u1, a1, u2, a2];

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });
  tl.set(all, { opacity: 0, y: 10 }, 0)
    .set(acts, { opacity: 0 }, 0)
    .to(u1, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.4)
    .to(a1, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 1.4)
    .to(acts, { opacity: 1, duration: 0.4 }, 2.2)
    .to(u2, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 4.4)
    .to(a2, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 5.4)
    .to(all, { opacity: 0, duration: 0.5, ease: 'power1.in' }, 9.6);
  return tl;
}

export function initSections(): (() => void) | void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hubSection = document.querySelector<HTMLElement>('[data-hub]');
  if (hubSection) fitZoom(hubSection);
  const onResize = () => hubSection && fitZoom(hubSection);
  window.addEventListener('resize', onResize);
  if (reduced) return () => window.removeEventListener('resize', onResize);

  const loops: gsap.core.Timeline[] = [];
  const ctx = gsap.context(() => {
    const hubUi = document.querySelector<HTMLElement>('[data-ui="hub"]');
    if (hubUi) {
      const tl = hubLoop(hubUi);
      loops.push(tl);
      whileVisible(hubUi, tl);
    }
    const audit = document.querySelector<HTMLElement>('[data-audit-list]');
    if (audit) {
      const tl = auditLoop(audit);
      loops.push(tl);
      whileVisible(audit, tl);
    }
    const chat = document.querySelector<HTMLElement>('[data-chat]');
    if (chat) {
      const tl = chatLoop(chat);
      loops.push(tl);
      whileVisible(chat, tl);
    }

    // Onboarding: the line fills as the steps scroll by
    const fill = document.querySelector<HTMLElement>('[data-start-fill]');
    if (fill) {
      const vertical = window.matchMedia('(max-width: 767px)').matches;
      gsap.to(fill, {
        [vertical ? 'scaleY' : 'scaleX']: 1,
        ease: 'none',
        scrollTrigger: { trigger: fill.parentElement, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
      });
    }
  });

  return () => {
    window.removeEventListener('resize', onResize);
    loops.forEach((l) => l.kill());
    ctx.revert();
  };
}
