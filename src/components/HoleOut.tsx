import React, { useEffect, useState } from 'react';
import { scoreName, withArticle, type BoardRow } from '@/lib/golf';

type Props = { strokes: number | null; onReset?: () => void };

/** The scorecard you sign after holing out, plus the Hole 1 leaderboard. */
const HoleOut = ({ strokes, onReset }: Props) => {
  const [board, setBoard] = useState<BoardRow[] | null>(null);
  const [boardError, setBoardError] = useState(false);
  const [initials, setInitials] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [rank, setRank] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setBoard(d.board))
      .catch(() => setBoardError(true));
  }, []);

  const shareUrl = strokes && typeof window !== 'undefined' ? `${window.location.origin}/s/${strokes}` : '';
  const tweet = strokes
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Holed Hole 1 on Yash Gandhi's course in ${strokes}. That's ${withArticle(scoreName(strokes))} ⛳ Beat it:`)}&url=${encodeURIComponent(shareUrl)}`
    : '';

  const sign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strokes || !initials) return;
    setState('saving');
    try {
      const r = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initials, strokes }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setBoard(d.board);
      setRank(d.rank);
      setState('saved');
    } catch (err) {
      setMessage(err instanceof Error && err.message ? err.message : 'Could not sign the card. Try again.');
      setState('error');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked; the X button still works
    }
  };

  return (
    <div className={strokes ? 'mt-4 grid sm:grid-cols-[minmax(0,1fr)_15rem] gap-5 items-start' : 'mt-4 flex sm:justify-end'}>
      <div className={strokes ? '' : 'hidden'}>
        {strokes ? (
          <>
            <p className="font-pencil text-3xl leading-tight text-flag">
              holed in {strokes}. that&apos;s {withArticle(scoreName(strokes))}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a href={tweet} target="_blank" rel="noopener noreferrer" className="btn-flag py-2.5 px-4 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Post your score
              </a>
              <button type="button" onClick={copy} className="btn-line py-2.5 px-4 text-sm">
                {copied ? 'Link copied' : 'Copy link'}
              </button>
              {onReset && (
                <button type="button" onClick={onReset} className="btn-line py-2.5 px-4 text-sm">
                  Play again
                </button>
              )}
            </div>

            {state === 'saved' ? (
              <p className="mt-5 font-pencil text-2xl text-sand">
                signed. {rank ? `you're #${rank} on the board.` : 'you are on the board.'}
              </p>
            ) : (
              <form onSubmit={sign} className="mt-5 flex items-end gap-3">
                <label className="block">
                  <span className="text-sm text-moss">Your initials</span>
                  <input
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))}
                    maxLength={3}
                    autoComplete="off"
                    spellCheck={false}
                    aria-describedby="initials-help"
                    className="mt-1 block w-24 bg-card text-[#2b2f8a] font-pencil text-3xl leading-none text-center rounded-[3px] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sand"
                    placeholder="ABC"
                  />
                </label>
                <button type="submit" disabled={!initials || state === 'saving'} className="btn-line py-2.5 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {state === 'saving' ? 'Signing…' : 'Sign the card'}
                </button>
              </form>
            )}
            <p id="initials-help" className="mt-2 text-sm text-moss">
              {state === 'error' ? <span className="text-[#ff8a7e]">{message}</span> : 'One to three letters. Lowest score leads.'}
            </p>
          </>
        ) : null}
      </div>

      <div className="w-full sm:w-60 bg-card text-ink rounded-[4px] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.65)] overflow-hidden">
        <p className="px-3 pt-2.5 pb-2 font-display uppercase text-lg leading-none" style={{ fontWeight: 800 }}>
          Hole 1 leaderboard
        </p>
        {boardError ? (
          <p className="px-3 pb-3 text-sm text-ink/75">The leaderboard is out on the course. Check back soon.</p>
        ) : board === null ? (
          <p className="px-3 pb-3 font-pencil text-xl text-ink/75">reading the card…</p>
        ) : board.length === 0 ? (
          <p className="px-3 pb-3 text-sm text-ink/75">Nobody has signed it yet. Hole out and be first.</p>
        ) : (
          <table className="w-full border-collapse tabular">
            <thead>
              <tr className="font-mono text-[10px] text-ink/75 text-left">
                <th className="px-3 py-1 font-medium w-10">POS</th>
                <th className="px-3 py-1 font-medium border-l border-ink/15">PLAYER</th>
                <th className="px-3 py-1 font-medium border-l border-ink/15 text-right">STROKES</th>
              </tr>
            </thead>
            <tbody>
              {board.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-t border-ink/15">
                  <td className="px-3 py-1 font-mono text-xs">{i + 1}</td>
                  <td className="px-3 py-0.5 border-l border-ink/15 font-pencil text-2xl leading-none text-[#2b2f8a]">{row.initials}</td>
                  <td className="px-3 py-1 border-l border-ink/15 font-mono text-sm text-right">{row.strokes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HoleOut;
