// All the data for the questionnaire lives here so the component stays simple.

export type FormData = {
  fullName: string;
  contactNumber: string;
  email: string;
  eventType: string;
  eventTypeOther: string;
  eventDate: string;
  venueLocation: string;
  guestCount: string;
  vibes: string[];
  colourPalette: string;
  themes: string;
  budgetRange: string;
  budgetStretch: string;
  focusAreas: string[];
  focusOther: string;
  mustInclude: string;
  avoid: string;
  supportType: string;
  supportOther: string;
  deliveryMethod: string;
  notes: string;
};

export const initialFormData: FormData = {
  fullName: '',
  contactNumber: '',
  email: '',
  eventType: '',
  eventTypeOther: '',
  eventDate: '',
  venueLocation: '',
  guestCount: '',
  vibes: [],
  colourPalette: '',
  themes: '',
  budgetRange: '',
  budgetStretch: '',
  focusAreas: [],
  focusOther: '',
  mustInclude: '',
  avoid: '',
  supportType: '',
  supportOther: '',
  deliveryMethod: '',
  notes: '',
};

export const eventTypes = ['Wedding', 'Birthday', 'Baby Shower', 'Anniversary', 'Other'];
export const guestRanges = ['Under 50', '50–150', '150–300', '300+'];
export const vibeOptions = ['Minimal & Elegant', 'Bold & Vibrant', 'Traditional', 'Contemporary', 'Indo-Western'];
export const budgetOptions = ['Under ₹50,000', '₹50,000–₹1,00,000', '₹1,00,000–₹2,00,000', '₹2,00,000+'];
export const stretchOptions = ['Yes', 'No', 'Maybe'];
export const focusOptions = ['Entrance & welcome area', 'Stage/Main setup', 'Seating area', 'Table styling', 'Photo booth', 'Other'];
export const supportOptions = ['Styling guidance only', 'Detailed styling plan', 'Execution support', 'Other'];
export const deliveryOptions = ['PDF', 'Google drive link'];

// Title + subtitle shown at the top of each step.
export const steps = [
  { title: "Let's get acquainted", subtitle: 'So we know who we are styling for.', note: 'Your details stay private — used only to send your styling concept.' },
  { title: 'What are we celebrating?', subtitle: 'The shape and scale of your event.', note: "Rough details are fine — we'll refine everything together." },
  { title: 'Your styling vision', subtitle: 'The mood, palette and feeling.', note: "Not sure yet? Pick what resonates and we'll shape the rest." },
  { title: 'Budget direction', subtitle: 'A range to design within.', note: 'This stays between us and simply guides the design scope.' },
  { title: 'Where should we focus?', subtitle: 'The moments that matter most.', note: "Choose as many as you like — or none, and we'll advise." },
  { title: 'Inspiration & support', subtitle: 'How hands-on should we be?', note: 'Screenshots, Pinterest saves, anything at all — it all helps.' },
  { title: 'Final touches', subtitle: 'How to send your styling concept.', note: 'We usually reply within two working days.' },
];

export const totalSteps = steps.length;

export function formatEventType(eventType: string, other: string) {
  if (eventType === 'Other') return other || 'Other event';
  return eventType;
}
