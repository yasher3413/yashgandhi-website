export const HOLE_ONE_PAR = 4;

/** Name for a score on the par-4 first hole. */
export const scoreName = (strokes: number) => {
  const names: Record<number, string> = { 1: 'hole in one', 2: 'eagle', 3: 'birdie', 4: 'par', 5: 'bogey', 6: 'double bogey', 7: 'triple bogey' };
  return names[strokes] ?? `${strokes} strokes`;
};

export const withArticle = (s: string) => (/^\d/.test(s) ? s : `${/^[aeiou]/.test(s) ? 'an' : 'a'} ${s}`);

export type BoardRow = { initials: string; strokes: number };
