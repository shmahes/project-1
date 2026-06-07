"use client";

import { useState } from 'react';
import {
  FormData,
  budgetOptions,
  deliveryOptions,
  eventTypes,
  focusOptions,
  formatEventType,
  guestRanges,
  initialFormData,
  steps,
  stretchOptions,
  supportOptions,
  totalSteps,
  vibeOptions,
} from './curatioSteps';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec';

export default function CuratioQuestionnaire() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialFormData);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // Update one text/single-choice field.
  function set(field: keyof FormData, value: string) {
    setData({ ...data, [field]: value });
  }

  // Add or remove a value from a multi-select field (vibes, focusAreas).
  function toggle(field: 'vibes' | 'focusAreas', value: string) {
    const list = data[field];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    setData({ ...data, [field]: next });
  }

  function next() {
    if (step < totalSteps) setStep(step + 1);
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  async function submit() {
    setSending(true);
    setError('');
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          eventType: formatEventType(data.eventType, data.eventTypeOther),
          vibes: data.vibes.join(', '),
          focusAreas: data.focusAreas.join(', '),
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  // Thank-you screen.
  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-2xl border border-brand-charcoal/10 bg-brand-cream p-10 text-center shadow-soft">
          <p className="font-script text-5xl text-brand-terracotta">Curatio</p>
          <h1 className="mt-4 font-serif text-4xl text-brand-charcoal">Your styling concept is on its way.</h1>
          <p className="mt-4 text-brand-charcoal/70">
            Thank you, {data.fullName || 'friend'}. We&apos;ll be in touch soon with styling made just for you.
          </p>
        </div>
      </div>
    );
  }

  const current = steps[step - 1];

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12 sm:items-center sm:py-10">
      {/* Fixed height (desktop) so every step's box is identical; buttons pinned to the bottom. */}
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-brand-cream p-7 shadow-soft sm:h-[740px] sm:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-script text-3xl text-brand-terracotta">Curatio</span>
        <span className="text-sm text-brand-charcoal/60">Step {step} of {totalSteps}</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 w-full rounded-full bg-brand-charcoal/15">
        <div
          className="h-full rounded-full bg-brand-terracotta transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Question — content sits at the top; the note is pinned to the bottom to fill short steps. */}
      <div key={step} className="fade mt-8 flex min-h-0 flex-col overflow-y-auto sm:flex-1">
        <h1 className="font-serif text-3xl text-brand-charcoal sm:text-4xl">{current.title}</h1>
        <p className="mt-1 text-brand-charcoal/60">{current.subtitle}</p>

        <div className="mt-8">
          {step === 1 && <StepContact data={data} set={set} />}
          {step === 2 && <StepEvent data={data} set={set} />}
          {step === 3 && <StepVision data={data} set={set} toggle={toggle} />}
          {step === 4 && <StepBudget data={data} set={set} />}
          {step === 5 && <StepFocus data={data} set={set} toggle={toggle} />}
          {step === 6 && <StepSupport data={data} set={set} />}
          {step === 7 && <StepFinal data={data} set={set} />}
        </div>

        <p className="mt-auto border-t border-brand-charcoal/10 pt-5 text-sm italic text-brand-charcoal/50">
          {current.note}
        </p>
      </div>

      {error && <p className="mt-6 text-sm text-brand-terracotta">{error}</p>}

      {/* Buttons */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 1}
          className="text-sm font-semibold text-brand-charcoal/60 hover:text-brand-charcoal disabled:opacity-30"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={step === totalSteps ? submit : next}
          disabled={sending}
          className="rounded-lg bg-brand-terracotta px-7 py-3 text-sm font-semibold text-brand-cream shadow-soft hover:opacity-90 disabled:opacity-50"
        >
          {sending ? 'Sending…' : step === totalSteps ? 'Submit' : 'Continue →'}
        </button>
      </div>
      </div>
    </div>
  );
}

/* ---------- small building blocks ---------- */

// A field label.
function Label({ text }: { text: string }) {
  return <span className="mb-2 block text-sm font-semibold text-brand-charcoal">{text}</span>;
}

// A selectable option button. Terracotta when selected, outlined when not.
function Option({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const base = 'rounded-lg border-2 px-4 py-3 text-left text-sm font-semibold shadow-soft';
  const style = selected
    ? 'border-brand-terracotta bg-brand-terracotta text-brand-cream'
    : 'border-brand-charcoal/20 text-brand-charcoal hover:border-brand-terracotta';
  return (
    <button type="button" onClick={onClick} className={`${base} ${style}`}>
      {label}
    </button>
  );
}

/* ---------- steps ---------- */

type StepProps = {
  data: FormData;
  set: (field: keyof FormData, value: string) => void;
};

type MultiProps = StepProps & {
  toggle: (field: 'vibes' | 'focusAreas', value: string) => void;
};

function StepContact({ data, set }: StepProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <label>
        <Label text="Full name" />
        <input value={data.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Your full name" />
      </label>
      <label>
        <Label text="Phone" />
        <input value={data.contactNumber} onChange={(e) => set('contactNumber', e.target.value)} placeholder="+91 98765 43210" />
      </label>
      <label>
        <Label text="Email" />
        <input type="email" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="hello@domain.com" />
      </label>
    </div>
  );
}

function StepEvent({ data, set }: StepProps) {
  return (
    <div className="space-y-7">
      <div>
        <Label text="Event type" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {eventTypes.map((type) => (
            <Option key={type} label={type} selected={data.eventType === type} onClick={() => set('eventType', type)} />
          ))}
        </div>
        {data.eventType === 'Other' && (
          <input
            className="mt-3"
            value={data.eventTypeOther}
            onChange={(e) => set('eventTypeOther', e.target.value)}
            placeholder="Tell us the type of event"
          />
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <label>
          <Label text="Date of event" />
          <input type="date" value={data.eventDate} onChange={(e) => set('eventDate', e.target.value)} />
        </label>
        <label>
          <Label text="City & venue" />
          <input value={data.venueLocation} onChange={(e) => set('venueLocation', e.target.value)} placeholder="e.g. Delhi, Taj Ballroom" />
        </label>
      </div>
      <div>
        <Label text="Guest count" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {guestRanges.map((range) => (
            <Option key={range} label={range} selected={data.guestCount === range} onClick={() => set('guestCount', range)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepVision({ data, set, toggle }: MultiProps) {
  return (
    <div className="space-y-7">
      <div>
        <Label text="The vibe (select all that apply)" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {vibeOptions.map((vibe) => (
            <Option key={vibe} label={vibe} selected={data.vibes.includes(vibe)} onClick={() => toggle('vibes', vibe)} />
          ))}
        </div>
      </div>
      <label>
        <Label text="Preferred colour palette" />
        <input value={data.colourPalette} onChange={(e) => set('colourPalette', e.target.value)} placeholder="warm earthy tones, soft pastels…" />
      </label>
      <label>
        <Label text="Themes or styles you love" />
        <input value={data.themes} onChange={(e) => set('themes', e.target.value)} placeholder="textured florals, muted luxury…" />
      </label>
    </div>
  );
}

function StepBudget({ data, set }: StepProps) {
  return (
    <div className="space-y-7">
      <div>
        <Label text="Budget for decor" />
        <div className="grid gap-3 sm:grid-cols-2">
          {budgetOptions.map((option) => (
            <Option key={option} label={option} selected={data.budgetRange === option} onClick={() => set('budgetRange', option)} />
          ))}
        </div>
      </div>
      <div>
        <Label text="If it feels perfect, could you go higher?" />
        <div className="grid grid-cols-3 gap-3">
          {stretchOptions.map((option) => (
            <Option key={option} label={option} selected={data.budgetStretch === option} onClick={() => set('budgetStretch', option)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepFocus({ data, set, toggle }: MultiProps) {
  return (
    <div className="space-y-7">
      <div>
        <Label text="Focus areas (select all that apply)" />
        <div className="grid gap-3 sm:grid-cols-2">
          {focusOptions.map((option) => (
            <Option key={option} label={option} selected={data.focusAreas.includes(option)} onClick={() => toggle('focusAreas', option)} />
          ))}
        </div>
      </div>
      <label>
        <Label text="Must-haves (optional)" />
        <input value={data.mustInclude} onChange={(e) => set('mustInclude', e.target.value)} placeholder="personalised seating cards…" />
      </label>
      <label>
        <Label text="Avoid (optional)" />
        <input value={data.avoid} onChange={(e) => set('avoid', e.target.value)} placeholder="plastic flowers, neon…" />
      </label>
    </div>
  );
}

function StepSupport({ data, set }: StepProps) {
  return (
    <div>
      <Label text="How hands-on should we be?" />
      <div className="grid gap-3 sm:grid-cols-2">
        {supportOptions.map((option) => (
          <Option key={option} label={option} selected={data.supportType === option} onClick={() => set('supportType', option)} />
        ))}
      </div>
      {data.supportType === 'Other' && (
        <input
          className="mt-3"
          value={data.supportOther}
          onChange={(e) => set('supportOther', e.target.value)}
          placeholder="Describe the support you need"
        />
      )}
    </div>
  );
}

function StepFinal({ data, set }: StepProps) {
  return (
    <div className="space-y-7">
      <div>
        <Label text="How should we deliver your package?" />
        <div className="grid grid-cols-2 gap-3">
          {deliveryOptions.map((option) => (
            <Option key={option} label={option} selected={data.deliveryMethod === option} onClick={() => set('deliveryMethod', option)} />
          ))}
        </div>
      </div>
      <label>
        <Label text="Anything else we should know?" />
        <textarea value={data.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Share anything that helps us capture your vision" />
      </label>
    </div>
  );
}
