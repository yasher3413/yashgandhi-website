import { useEffect, useState } from 'react';

export const useMedia = (query: string, fallback = false) => {
  const [match, setMatch] = useState(fallback);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const set = () => setMatch(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, [query]);
  return match;
};
