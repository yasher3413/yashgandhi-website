import { RefObject, useEffect, useState } from 'react';

/**
 * Which `[data-shot]` child of `ref` has scrolled past the reading line.
 * -1 means the visitor is still on the tee.
 */
export const useActiveShot = (ref: RefObject<HTMLElement>) => {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const line = window.innerHeight * 0.62;
      const shots = Array.from(el.querySelectorAll<HTMLElement>('[data-shot]'));
      let next = -1;
      shots.forEach((s, i) => {
        if (s.getBoundingClientRect().top < line) next = i;
      });
      setActive(next);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return active;
};
