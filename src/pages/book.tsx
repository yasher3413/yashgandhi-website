import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

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

  return (
    <>
      <Head>
        <title>Book a Call • Yash Gandhi</title>
        <meta name="description" content="Book a call with Yash Gandhi" />
      </Head>

      <main className="min-h-screen">
        <section className="pt-28 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-secondary transition-colors mb-4"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to home
              </a>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">Book a Call</h1>
              <p className="text-gray-300 mt-4 max-w-2xl">
                Pick a time that works for you and share a bit of context (optional). I’ll follow up with a
                calendar invite.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">
              <div className="bg-tertiary/50 p-6 rounded-2xl border border-secondary/20">
                <h2 className="text-2xl font-semibold text-secondary mb-4">Select a time</h2>

                {isLoading ? (
                  <div className="flex items-center justify-center min-h-[240px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
                  </div>
                ) : error ? (
                  <p className="text-red-400">{error}</p>
                ) : availableDates.length === 0 ? (
                  <p className="text-gray-400">No availability right now. Please check back soon.</p>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {availableDates.map((dateKey) => (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dateKey);
                            setSelectedSlot(slots[dateKey]?.[0] ?? null);
                          }}
                          className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                            selectedDate === dateKey
                              ? 'bg-secondary text-primary border-secondary'
                              : 'border-secondary/30 text-gray-300 hover:border-secondary'
                          }`}
                        >
                          {formatDateLabel(dateKey)}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {timesForSelectedDate.map((slot) => (
                        <button
                          key={slot.start}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                            selectedSlot?.start === slot.start
                              ? 'bg-secondary text-primary border-secondary'
                              : 'border-secondary/20 text-gray-300 hover:border-secondary'
                          }`}
                        >
                          {formatTimeLabel(slot.start)}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Times shown in {timeZone}.</p>
                  </div>
                )}
              </div>

              <div className="bg-tertiary/50 p-6 rounded-2xl border border-secondary/20">
                <h2 className="text-2xl font-semibold text-secondary mb-4">Your details</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-lg bg-primary/60 border border-secondary/20 px-3 py-2 text-gray-100 focus:outline-none focus:border-secondary"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      className="w-full rounded-lg bg-primary/60 border border-secondary/20 px-3 py-2 text-gray-100 focus:outline-none focus:border-secondary"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Additional notes</label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={4}
                      className="w-full rounded-lg bg-primary/60 border border-secondary/20 px-3 py-2 text-gray-100 focus:outline-none focus:border-secondary"
                      placeholder="What should we chat about?"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!selectedSlot || isSubmitting}
                      className="w-full px-6 py-3 bg-secondary/10 border border-secondary rounded-full hover:bg-secondary/20 transition-all duration-300 text-secondary text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Booking…' : 'Book call'}
                    </button>
                  </div>
                </form>

                {successMessage && (
                  <p className="mt-4 text-sm text-secondary">{successMessage}</p>
                )}
                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BookPage;
