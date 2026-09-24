import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import TopoField from '@/components/course/TopoField';

type Slot = {
  start: string;
  end: string;
};

type SlotsResponse = {
  data?: Record<string, Slot[]>;
};

const formatDateLabel = (dateKey: string) => {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTimeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

const BookPage = () => {
  const [slots, setSlots] = useState<Record<string, Slot[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [timeZone, setTimeZone] = useState('UTC');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC');
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/cal/slots?timeZone=${encodeURIComponent(timeZone)}`);
        const data: SlotsResponse = await response.json();
        if (!response.ok) {
          throw new Error(data?.data ? 'Failed to load slots' : 'Failed to load slots');
        }
        const normalized = data?.data ?? {};
        setSlots(normalized);
        const firstDate = Object.keys(normalized).find((key) => normalized[key]?.length);
        setSelectedDate(firstDate ?? null);
        setSelectedSlot(firstDate && normalized[firstDate]?.length ? normalized[firstDate][0] : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load slots');
      } finally {
        setIsLoading(false);
      }
    };

    if (timeZone) {
      loadSlots();
    }
  }, [timeZone]);

  const availableDates = useMemo(
    () => Object.keys(slots).filter((key) => slots[key]?.length),
    [slots]
  );

  const timesForSelectedDate = selectedDate ? slots[selectedDate] ?? [] : [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSlot) return;
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/cal/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: new Date(selectedSlot.start).toISOString(),
          name,
          email,
          notes,
          timeZone,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to book this time');
      }
      setSuccessMessage('Booking confirmed! Check your email for details.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book this time');
    } finally {
      setIsSubmitting(false);
    }
  };

  const field =
    'w-full bg-transparent border-0 border-b border-chalk/30 px-0 py-2.5 text-lg text-chalk placeholder:text-moss/70 focus:outline-none focus:border-sand focus-visible:outline-none transition-colors';

  return (
    <>
      <Head>
        <title>Book a Call • Yash Gandhi</title>
        <meta name="description" content="Book a call with Yash Gandhi" />
      </Head>

      <TopoField />
      <main className="relative min-h-screen">
        <section className="mx-auto max-w-[1180px] px-4 sm:px-8 pt-10 pb-24">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-moss hover:text-chalk transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M8 2L4 6l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Back to home
          </Link>

          <header className="mt-10 sm:mt-14">
            <h1 className="font-display uppercase text-chalk leading-[0.82] text-[clamp(4rem,12vw,9rem)]" style={{ fontWeight: 900 }}>
              Book a Call
            </h1>
            <p className="mt-5 text-lg text-mist max-w-[56ch]">
              Pick a time that works for you and share a bit of context (optional). I’ll follow up with a calendar invite.
            </p>
          </header>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display uppercase text-chalk text-3xl sm:text-4xl" style={{ fontWeight: 800 }}>
                  Select a time
                </h2>
                <span className="font-pencil text-2xl text-sand">the tee sheet</span>
              </div>

              <div className="mt-5 bg-card text-ink rounded-[4px] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
                {isLoading ? (
                  <p className="px-5 py-16 font-pencil text-2xl text-ink/70 text-center">checking the tee sheet…</p>
                ) : error && availableDates.length === 0 ? (
                  <p className="px-5 py-16 text-center text-[#b3261e]">{error}. Refresh to try again.</p>
                ) : availableDates.length === 0 ? (
                  <p className="px-5 py-16 text-center text-ink/70">No availability right now. Please check back soon.</p>
                ) : (
                  <>
                    <div className="flex overflow-x-auto border-b border-ink/20" role="tablist" aria-label="Dates">
                      {availableDates.map((dateKey) => {
                        const on = selectedDate === dateKey;
                        const [wd, ...rest] = formatDateLabel(dateKey).split(' ');
                        return (
                          <button
                            key={dateKey}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            onClick={() => {
                              setSelectedDate(dateKey);
                              setSelectedSlot(slots[dateKey]?.[0] ?? null);
                            }}
                            className={`shrink-0 min-w-[5.5rem] px-4 py-3 text-left border-r border-ink/15 transition-colors ${
                              on ? 'bg-ink text-card' : 'hover:bg-ink/5'
                            }`}
                          >
                            <span className="block font-mono text-[10px] uppercase tracking-[0.08em] opacity-70">{wd.replace(',', '')}</span>
                            <span className="block font-display text-2xl leading-tight" style={{ fontWeight: 800 }}>
                              {rest.join(' ')}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <table className="w-full border-collapse tabular">
                      <thead>
                        <tr className="font-mono text-[10px] text-ink/75 text-left">
                          <th className="px-5 py-2 font-medium w-1/2">TEE TIME</th>
                          <th className="px-5 py-2 font-medium border-l border-ink/15">PLAYER</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timesForSelectedDate.map((slot) => {
                          const on = selectedSlot?.start === slot.start;
                          return (
                            <tr key={slot.start} className="border-t border-ink/15">
                              <td className="p-0" colSpan={2}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedSlot(slot)}
                                  aria-pressed={on}
                                  className={`w-full grid grid-cols-2 text-left transition-colors ${on ? 'bg-flag/10' : 'hover:bg-ink/5'}`}
                                >
                                  <span className="px-5 py-3 font-mono text-sm">{formatTimeLabel(slot.start)}</span>
                                  <span className="px-5 py-2 border-l border-ink/15 font-pencil text-2xl leading-8 text-[#2b2f8a]">
                                    {on ? (name.trim() ? name.trim().split(' ')[0] : 'you') : ''}
                                  </span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
              <p className="mt-3 text-sm text-moss">Times shown in {timeZone}.</p>
            </div>

            <div className="bg-deep rounded-[4px] ring-1 ring-chalk/10 p-6 sm:p-8">
              <h2 className="font-display uppercase text-chalk text-3xl sm:text-4xl" style={{ fontWeight: 800 }}>
                Your details
              </h2>
              {selectedSlot && (
                <p className="mt-2 font-mono text-xs text-moss tabular">
                  {selectedDate && formatDateLabel(selectedDate)} <span className="text-chalk/30 px-1">/</span> {formatTimeLabel(selectedSlot.start)}
                </p>
              )}
              <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm text-moss">Name</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} className={field} placeholder="Your full name" autoComplete="name" required />
                </label>
                <label className="block">
                  <span className="text-sm text-moss">Email</span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    className={field}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-moss">Additional notes</span>
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className={`${field} resize-none`} placeholder="What should we chat about?" />
                </label>

                <button type="submit" disabled={!selectedSlot || isSubmitting || !!successMessage} className="btn-flag w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                  {isSubmitting ? 'Booking…' : successMessage ? 'Booked' : 'Book call'}
                </button>
              </form>

              <div aria-live="polite">
                {successMessage && <p className="mt-5 font-pencil text-2xl text-sand">{successMessage}</p>}
                {error && availableDates.length > 0 && <p className="mt-5 text-sm text-[#ff8a7e]">{error}</p>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BookPage;
