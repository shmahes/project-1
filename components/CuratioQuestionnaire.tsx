"use client";

import { useState } from 'react';
import {
  FormData,
  budgetOptions,
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
    <div className="flex min-h-[100dvh] items-center justify-center p-4 sm:p-6">
      {/* The card is capped to the viewport so the footer is always visible; the question area
          scrolls inside. A shared min-height gives short steps a comfortable baseline. */}
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-brand-cream p-7 shadow-soft sm:max-h-[calc(100dvh-3rem)] sm:min-h-[620px] sm:p-10">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between">
        <span className="font-script text-3xl text-brand-terracotta">Curatio</span>
        <span className="text-sm text-brand-charcoal/60">Step {step} of {totalSteps}</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 w-full shrink-0 rounded-full bg-brand-charcoal/15">
        <div
          className="h-full rounded-full bg-brand-terracotta transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Question — scrolls inside the card so the footer stays pinned; note sits at the bottom. */}
      <div key={step} className="fade mt-8 flex min-h-0 flex-1 flex-col overflow-y-auto pb-2">
        <h1 className="font-serif text-3xl text-brand-charcoal sm:text-4xl">{current.title}</h1>
        <p className="mt-1 text-brand-charcoal/60">{current.subtitle}</p>

        <div className="mt-8 flex-1">
          {step === 1 && <StepContact data={data} set={set} />}
          {step === 2 && <StepEvent data={data} set={set} />}
          {step === 3 && <StepVision data={data} set={set} toggle={toggle} />}
          {step === 4 && <StepBudget data={data} set={set} />}
          {step === 5 && <StepFocus data={data} set={set} toggle={toggle} />}
          {step === 6 && <StepSupport data={data} set={set} />}
          {step === 7 && <StepFinal data={data} set={set} goTo={setStep} />}
        </div>

        <p className="mt-8 text-sm italic text-brand-charcoal/50">{current.note}</p>
      </div>

      {error && <p className="mt-4 shrink-0 text-sm text-brand-terracotta">{error}</p>}

      {/* Footer — pinned to the bottom of the card, always visible while content scrolls above. */}
      <div className="mt-6 flex shrink-0 items-center justify-between border-t border-brand-charcoal/10 pt-6">
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

// THE one option card, used for every tappable choice on every step.
// Fixed min-height fits a two-line label, so cards are identical regardless of label length;
// short labels are vertically centred. Filled terracotta + check when selected (not colour-only).
function Option({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const base =
    'flex min-h-[3rem] items-center justify-between gap-2 rounded-lg border-2 px-4 py-3 text-left text-sm font-semibold transition duration-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream';
  const style = selected
    ? 'border-brand-terracotta bg-brand-terracotta text-brand-cream'
    : 'border-brand-charcoal/20 text-brand-charcoal hover:border-brand-terracotta';
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={`${base} ${style}`}>
      <span>{label}</span>
      {selected && (
        <span aria-hidden className="shrink-0 text-base leading-none">
          ✓
        </span>
      )}
    </button>
  );
}

// THE one labelled text field, used for every free-text input. Inherits the bordered-box
// styling from globals.css so it matches the OptionCard family; label + gap are identical everywhere.
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <Label text={label} />
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
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
    <div className="grid gap-x-4 gap-y-8 sm:grid-cols-3">
      <Field label="Full name" value={data.fullName} onChange={(v) => set('fullName', v)} placeholder="Your full name" />
      <Field label="Phone" value={data.contactNumber} onChange={(v) => set('contactNumber', v)} placeholder="+91 98765 43210" />
      <Field label="Email" type="email" value={data.email} onChange={(v) => set('email', v)} placeholder="hello@domain.com" />
    </div>
  );
}

function StepEvent({ data, set }: StepProps) {
  return (
    <div className="space-y-8">
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
      <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
        <Field label="Date of event" type="date" value={data.eventDate} onChange={(v) => set('eventDate', v)} />
        <Field label="City & venue" value={data.venueLocation} onChange={(v) => set('venueLocation', v)} placeholder="e.g. Delhi, Taj Ballroom" />
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
    <div className="space-y-8">
      <div>
        <Label text="The vibe (select all that apply)" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {vibeOptions.map((vibe) => (
            <Option key={vibe} label={vibe} selected={data.vibes.includes(vibe)} onClick={() => toggle('vibes', vibe)} />
          ))}
        </div>
      </div>
      <Field label="Preferred colour palette" value={data.colourPalette} onChange={(v) => set('colourPalette', v)} placeholder="warm earthy tones, soft pastels…" />
      <Field label="Themes or styles you love" value={data.themes} onChange={(v) => set('themes', v)} placeholder="textured florals, muted luxury…" />
    </div>
  );
}

function StepBudget({ data, set }: StepProps) {
  return (
    <div className="space-y-8">
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
    <div className="space-y-8">
      <div>
        <Label text="Focus areas (select all that apply)" />
        <div className="grid gap-3 sm:grid-cols-2">
          {focusOptions.map((option) => (
            <Option key={option} label={option} selected={data.focusAreas.includes(option)} onClick={() => toggle('focusAreas', option)} />
          ))}
        </div>
      </div>
      <Field label="Must-haves (optional)" value={data.mustInclude} onChange={(v) => set('mustInclude', v)} placeholder="personalised seating cards…" />
      <Field label="Avoid (optional)" value={data.avoid} onChange={(v) => set('avoid', v)} placeholder="plastic flowers, neon…" />
    </div>
  );
}

function StepSupport({ data, set }: StepProps) {
  return (
    <div>
      <Label text="Choose the level of support" />
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

// A scannable recap row. Tappable to jump back to the step that owns it (not editable here).
function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-brand-charcoal/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-terracotta"
    >
      <span className="shrink-0 text-sm text-brand-charcoal/60">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-semibold text-brand-charcoal">{value || '—'}</span>
        <span aria-hidden className="shrink-0 text-brand-terracotta">›</span>
      </span>
    </button>
  );
}

function StepFinal({ data, set, goTo }: StepProps & { goTo: (step: number) => void }) {
  const rows = [
    { label: 'Event', value: formatEventType(data.eventType, data.eventTypeOther), step: 2 },
    { label: 'Date', value: data.eventDate, step: 2 },
    { label: 'Venue', value: data.venueLocation, step: 2 },
    { label: 'Guests', value: data.guestCount, step: 2 },
    { label: 'Vibe', value: data.vibes.join(', '), step: 3 },
    { label: 'Budget', value: data.budgetRange, step: 4 },
    { label: 'Focus', value: data.focusAreas.join(', '), step: 5 },
    { label: 'Support', value: data.supportType === 'Other' ? data.supportOther : data.supportType, step: 6 },
  ];
  return (
    <div className="space-y-8">
      <div>
        <Label text="Review your brief" />
        <div className="divide-y divide-brand-charcoal/10 overflow-hidden rounded-lg border-2 border-brand-charcoal/15">
          {rows.map((row) => (
            <SummaryRow key={row.label} label={row.label} value={row.value} onEdit={() => goTo(row.step)} />
          ))}
        </div>
      </div>
      <label className="block">
        <Label text="Anything else we should know?" />
        <textarea value={data.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Share anything that helps us capture your vision" />
      </label>
    </div>
  );
}
