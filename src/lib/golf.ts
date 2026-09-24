export const PARS = [4, 3, 4, 3, 5, 3, 5, 4, 4];
export const COURSE_PAR = PARS.reduce((a, b) => a + b, 0);
export const MAX_PER_HOLE = 10;

/** What a golfer calls this score on a hole of this par. */
export const scoreName = (strokes: number, par = 4) => {
  if (strokes === 1) return 'hole in one';
  const names: Record<number, string> = { [-3]: 'albatross', [-2]: 'eagle', [-1]: 'birdie', 0: 'par', 1: 'bogey', 2: 'double bogey', 3: 'triple bogey' };
  return names[strokes - par] ?? `${strokes} strokes`;
};

export const withArticle = (s: string) => (/^\d/.test(s) ? s : `${/^[aeiou]/.test(s) ? 'an' : 'a'} ${s}`);

/** "+3", "−2", "E" */
export const toPar = (n: number) => (n === 0 ? 'E' : n > 0 ? `+${n}` : `−${-n}`);

export type BoardRow = { initials: string; strokes: number };
export type BoardKind = 'hole1' | 'round';
