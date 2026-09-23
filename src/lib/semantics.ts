import {
  AlertOctagon, BookMarked, CalendarClock, Coins, Compass, Gift, GraduationCap, Home,
  Info, Landmark, ListChecks, MessageCircleQuestion, PenLine, PieChart, Receipt, Repeat,
  ShieldCheck, Target, TrendingDown, TrendingUp, Wallet,
} from 'lucide-react'

/* ───────────────────────────────────────────────────────────────────────────
   One semantic vocabulary for the whole product.

   This replaces eight separate lookup tables that all encoded the same idea
   — STATUS_META, MOMENT_META, TRIGGER_META, TYPE_META, PRIORITY_CHIP,
   SEVERITY, VERDICT_CHIP, COMPLIANCE_BADGE, RISK_COLOR, STATUS_CHIP — each
   with its own alpha step (/10, /12, /14, /16 were all in use for the same
   visual intent) and its own idea of which colour meant what.

   Two rules the old maps could not express:

   1. A chip's text is NOT its data colour. No colour can be both a valid
      data series (OKLCH L > 0.55, so it can never be mistaken for brand ink)
      and readable as small text on a 12% tint of itself. Measured on paper,
      the data values reach only 4.11:1 (danger), 2.75:1 (warning) and
      2.86:1 (success). So the roles split: the tint is the data colour, the
      text is the matching *-ink token. Worst chip in the system is now
      4.89:1, against 2.75:1 before.

   2. Tone is not the same thing as meaning. `critical` is a tone; "a holding
      left the house view" is a meaning. Meanings map onto tones below, so
      changing how "critical" looks is one edit, not nine.

   The domain types below (RelationshipStatus, MomentType, …) are declared
   here rather than imported from the app's domain-shapes file: this file is
   the kit's only carrier of what those unions mean, and the kit must not
   carry the 1,000+ line file the app hangs the same names off.
   ─────────────────────────────────────────────────────────────────────────── */

export type Tone =
  | 'critical'
  | 'caution'
  | 'positive'
  | 'informative'
  | 'neutral'
  | 'brand'
  | 'accent'

/** A client relationship's lifecycle stage. */
export type RelationshipStatus = 'prospect' | 'active_client' | 'dormant' | 'churned'
/** What kind of thing surfaced on a relationship's timeline. */
export type MomentType = 'life_event' | 'drift_alert' | 'meeting_due' | 'house_view_change' | 'review_resolved' | 'other'
/** What put a case into the portfolio-analyst queue. */
export type TriggeredBy = 'engine_hard_rule' | 'engine_drift_score' | 'rm_request'
/** A row's kind on the Control Tower feed. */
export type ControlTowerItemType =
  | 'meeting_scheduled' | 'life_event_meeting' | 'circular_update'
  | 'meeting_action' | 'crm_movement' | 'churn_risk' | 'planning_opportunity'
  | 'client_request'
/** One of the three planning lenses. */
export type PlanningDomain = 'investment' | 'tax' | 'estate'
/** How urgent a planning finding is. */
export type PlanningPriority = 'high' | 'medium' | 'low'
/** How urgent a Control Tower row is. */
export type ControlTowerPriority = 'high' | 'medium' | 'low'
/** Whether an agent is live, paused or unpublished. */
export type AgentStatus = 'active' | 'paused' | 'draft'
/** The outcome of a compliance or quality check. */
export type Verdict = 'pass' | 'fail'
/** Whether a rule is mandatory or a recommendation. */
export type Enforcement = 'required' | 'advisory'
/** One phase of an agent run's timeline. */
export type RunStepKind = 'asked' | 'looked' | 'acted' | 'produced' | 'review'
/** Whether a financial plan is tracking to its goal. */
export type HealthStatus = 'on_track' | 'attention' | 'off_track'
/** Whether a single goal is tracking to its target. */
export type GoalStatus = 'ahead' | 'on_track' | 'slightly_short' | 'short' | 'no_target'
/** What kind of goal an investor is funding. */
export type GoalKind = 'retirement' | 'education' | 'property' | 'legacy' | 'liquidity' | 'other'
/** Whether an external institution link is working. */
export type InstitutionLinkStatus = 'pending' | 'connected' | 'failed' | 'manual'
/** What kind of account activity a portal timeline entry records. */
export type InvestorActivityKind = 'contribution' | 'withdrawal' | 'trade' | 'dividend' | 'fee'
/** What kind of change a portal timeline entry records. */
export type InvestorChangeKind = 'moment' | 'activity' | 'account' | 'signature' | 'balance' | 'contribution'

/* ── Chips ───────────────────────────────────────────────────────────────────
   Two different things were being called "a chip", and collapsing them into one
   traffic-light scale is what put red and amber into the chrome — which the
   palette forbids, because red and green belong to data.

   They separate cleanly:

   1. WORKFLOW STATE — is this open, or dealt with? Four variants, no hue except
      the accent. Lime says the platform is asking; ink says it is settled.
      This is the vocabulary the Control Tower rows and audit tags speak.

   2. A DATA FIELD'S VALUE — "Churned", "Outside house view", "Over risked".
      These are facts about a record, so a semantic colour is legitimate; but
      they render as an OUTLINE with coloured text rather than a filled tint,
      so a fact never shouts louder than an action.                          */

export const chipBase =
  'inline-flex items-center gap-1 whitespace-nowrap rounded-chip px-2.5 py-[3px] text-[9.5px] font-semibold uppercase tracking-[.07em]'

export const CHIP = {
  /** Open, asking, not yet settled. The one place solid lime belongs. */
  open: 'bg-accent text-on-accent',
  /** Settled and affirmative — "Brief ready", "Approved". */
  done: 'bg-ink text-on-ink',
  /** Secondary. An outline, not a fill — so the outline is the whole chip,
   *  and owes the 3:1 floor a hairline does not. --hair-strong measures 1.59
   *  on light and 1.74 on dark; --edge is the same hue at 3.0. */
  out: 'text-ink-muted shadow-[inset_0_0_0_1px_var(--color-edge)]',
  /** Quiet default. */
  quiet: 'bg-sunken text-ink-muted',
} as const

type ToneStyles = {
  /** A data field's value, as a chip: outline + semantic ink. */
  chip: string
  /** Text only. */
  text: string
  /** A solid data mark — severity dot, legend swatch. Uses the data value. */
  dot: string
  /** A filled bar (risk distribution, progress). */
  bar: string
}

/* Chalk·Glass status chip: a pale TINT carrying its paired INK. The earlier
   outline treatment existed because a filled chip had been tried as the mid
   data colour with light text, which failed AA. This is the other
   construction — pale background, dark ink — and the pairings are measured:
   success 6.00:1, warning 5.41:1, danger 5.86:1, info 7.17:1.

   No border. One shape, one height, from chipBase.

   Written out literally, never built from a template — Tailwind scans source
   TEXT for class names, so `bg-${tone}-tint` would generate nothing. */
export const TONE: Record<Tone, ToneStyles> = {
  critical: { chip: 'bg-danger-tint text-danger-ink', text: 'text-danger-ink', dot: 'bg-danger', bar: 'bg-danger' },
  caution: { chip: 'bg-warning-tint text-warning-ink', text: 'text-warning-ink', dot: 'bg-warning', bar: 'bg-warning' },
  positive: { chip: 'bg-success-tint text-success-ink', text: 'text-success-ink', dot: 'bg-success', bar: 'bg-success' },
  informative: { chip: 'bg-info-tint text-info-ink', text: 'text-info-ink', dot: 'bg-info', bar: 'bg-info' },
  neutral: { chip: CHIP.quiet, text: 'text-ink-muted', dot: 'bg-hair-strong', bar: 'bg-hair-strong' },
  brand: { chip: 'bg-accent-quiet text-accent', text: 'text-accent', dot: 'bg-accent', bar: 'bg-accent' },
  /* The accent keeps its SOLID fill. A ~12% accent tint measures about 1.03:1
     against --raised, so it would not read as a filled chip at all. */
  accent: { chip: CHIP.open, text: 'text-accent', dot: 'bg-accent', bar: 'bg-accent' },
}

/** Every meaning below resolves to a tone, so a restyle is one edit. */
type Meaning<T extends string> = Record<T, { label: string; tone: Tone }>

/* ── Relationship status ─────────────────────────────────────────────────── */
export const RELATIONSHIP_STATUS: Meaning<RelationshipStatus> = {
  prospect: { label: 'Prospect', tone: 'informative' },
  active_client: { label: 'Active client', tone: 'positive' },
  dormant: { label: 'Dormant', tone: 'caution' },
  churned: { label: 'Churned', tone: 'critical' },
}

/* ── Moments ─────────────────────────────────────────────────────────────── */
export const MOMENT: Record<
  MomentType,
  { label: string; plural: string; Icon: typeof Info; tone: Tone }
> = {
  drift_alert: { label: 'Drift alert', plural: 'Drift alerts', Icon: TrendingDown, tone: 'critical' },
  house_view_change: { label: 'House view change', plural: 'House view changes', Icon: BookMarked, tone: 'accent' },
  review_resolved: { label: 'Review resolved', plural: 'Reviews resolved', Icon: ShieldCheck, tone: 'positive' },
  meeting_due: { label: 'Meeting due', plural: 'Meetings due', Icon: CalendarClock, tone: 'informative' },
  life_event: { label: 'Life event', plural: 'Life events', Icon: Gift, tone: 'accent' },
  other: { label: 'Signal', plural: 'Signals', Icon: Info, tone: 'neutral' },
}

/* ── Portfolio-analyst queue triggers ────────────────────────────────────────
   The three entry points must stay visually distinct: "the system thinks this
   is wrong" and "an RM wants a second opinion" are different tasks, not just
   different badges. `question` is what the analyst is actually answering. */
export const TRIGGER: Record<
  TriggeredBy,
  { label: string; question: string; Icon: typeof AlertOctagon; tone: Tone }
> = {
  engine_hard_rule: {
    label: 'Hard rule',
    question: 'The engine says this breaks a house-view rule.',
    Icon: AlertOctagon,
    tone: 'critical',
  },
  engine_drift_score: {
    label: 'Drift score',
    question: 'The engine flagged high allocation drift.',
    Icon: TrendingDown,
    tone: 'caution',
  },
  rm_request: {
    label: 'RM request',
    question: 'An RM asked for a second opinion.',
    Icon: MessageCircleQuestion,
    tone: 'informative',
  },
}

/* ── Control Tower items ─────────────────────────────────────────────────── */
export const CONTROL_TOWER_ITEM: Record<
  ControlTowerItemType,
  { label: string; Icon: typeof Info; tone: Tone }
> = {
  circular_update: { label: 'Circular update', Icon: BookMarked, tone: 'accent' },
  meeting_scheduled: { label: 'Meeting', Icon: CalendarClock, tone: 'informative' },
  life_event_meeting: { label: 'Life event', Icon: Gift, tone: 'caution' },
  meeting_action: { label: 'Follow-up', Icon: ListChecks, tone: 'critical' },
  crm_movement: { label: 'CRM signal', Icon: TrendingUp, tone: 'brand' },
  /* Its own meaning, not a CRM signal. "No contact in 54 days" is an
     observation; "churn risk" is what the observation MEANS, and it is the only
     row on this surface where the cost of ignoring it is losing the client
     rather than doing the work later. Critical, and it says so. */
  churn_risk: { label: 'Churn risk', Icon: TrendingDown, tone: 'critical' },
  planning_opportunity: { label: 'Planning', Icon: Compass, tone: 'brand' },
  /* The one row on this surface where a person is waiting for a reply. Accent,
     not critical: the platform is asking, and nothing has gone wrong. */
  client_request: { label: 'Client asked', Icon: MessageCircleQuestion, tone: 'accent' },
}

/* ── Planning ────────────────────────────────────────────────────────────────
   Three lenses, one vocabulary.

   The icons do the work the sub-tabs used to: they let an advisor tell at a
   glance which lens a row came from while the rows still sit in ONE list. That
   is the whole difference between "Investment | Tax | Estate" as tabs and as
   sections — a tab makes you choose a product before you can look, a label
   inside one list lets you read across all three.

   All three take the same neutral tone on purpose. A domain is not a severity:
   tax findings are not more urgent than estate findings, and colouring the lens
   would spend the palette on a category while leaving nothing to say which rows
   actually need the advisor. Priority carries that, below. */
export const PLANNING_DOMAIN: Record<
  PlanningDomain,
  { label: string; Icon: typeof Info; blurb: string }
> = {
  investment: {
    label: 'Investment',
    Icon: PieChart,
    blurb: 'How the money is allocated, and whether that still fits.',
  },
  tax: {
    label: 'Tax',
    Icon: Receipt,
    blurb: 'What the portfolio position means for this year\'s tax bill.',
  },
  estate: {
    label: 'Estate',
    Icon: Landmark,
    blurb: 'Where this wealth is ultimately headed, and what is on file.',
  },
}

/* Priority IS a severity, so it gets the tinted scale — but it is deliberately
   the only thing on a planning row that does. */
export const PLANNING_PRIORITY: Meaning<PlanningPriority> = {
  high: { label: 'High', tone: 'critical' },
  medium: { label: 'Medium', tone: 'caution' },
  low: { label: 'Low', tone: 'neutral' },
}

export const PRIORITY: Meaning<ControlTowerPriority> = {
  high: { label: 'High', tone: 'critical' },
  medium: { label: 'Medium', tone: 'caution' },
  low: { label: 'Low', tone: 'neutral' },
}

/* ── Insights ────────────────────────────────────────────────────────────── */
export const SEVERITY: Meaning<'high' | 'medium' | 'low'> = {
  high: { label: 'High', tone: 'critical' },
  medium: { label: 'Medium', tone: 'caution' },
  low: { label: 'Low', tone: 'informative' },
}

export const RISK_VERDICT: Meaning<'aligned' | 'over_risked' | 'under_risked' | 'unknown'> = {
  aligned: { label: 'Aligned', tone: 'positive' },
  over_risked: { label: 'Over risked', tone: 'critical' },
  under_risked: { label: 'Under risked', tone: 'caution' },
  unknown: { label: 'Unknown', tone: 'neutral' },
}

export const COMPLIANCE: Meaning<'whitelisted' | 'non_whitelisted' | 'missing_isin'> = {
  whitelisted: { label: 'In house view', tone: 'positive' },
  non_whitelisted: { label: 'Outside house view', tone: 'critical' },
  missing_isin: { label: 'Missing ISIN', tone: 'caution' },
}

export const HOUSE_VIEW_STATUS: Meaning<'draft' | 'published' | 'superseded'> = {
  draft: { label: 'Draft', tone: 'caution' },
  published: { label: 'Published', tone: 'positive' },
  superseded: { label: 'Superseded', tone: 'neutral' },
}

/* A version's status is the state vocabulary almost word for word: a draft is
   open and asking, a published version is the settled affirmative, a superseded
   one is history. Amber-for-draft made an ordinary working state look like a
   warning. */
export const HOUSE_VIEW_CHIP: Record<'draft' | 'published' | 'superseded', string> = {
  draft: CHIP.open,
  published: CHIP.done,
  superseded: CHIP.quiet,
}

/* ── Risk bands ──────────────────────────────────────────────────────────────
   Not a tone: this is an ordinal DATA scale, so it uses literal data values
   rather than semantic ones, and every step sits above the OKLCH L 0.55 floor.
   Ordered by intensity so the scale reads as risk increasing, and separated by
   value rather than hue so it survives greyscale. */
/* These were four literal hexes, which meant the scale could not flip: on a
   dark card Unprofiled (chalk-200) and Conservative (slate-300) collapsed into
   the same light grey. They are tokens now, cut once per theme in index.css,
   and consumed through inline `style` — a var() resolves reliably there, where
   it does not as a bare SVG `fill` presentation attribute. */
export const RISK_BAND: Record<string, string> = {
  Conservative: 'var(--color-risk-conservative)',
  Moderate: 'var(--color-risk-moderate)',
  Aggressive: 'var(--color-risk-aggressive)',
  Unprofiled: 'var(--color-risk-unprofiled)',
}

/* ── Administration: the AI control panel ────────────────────────────────────
   These meanings join the table above rather than starting a second one. An
   agent's status, a check's verdict and a rule's enforcement are facts about a
   record in exactly the way "Churned" and "Over risked" are, so they read as
   outlined data chips and not as chrome — an administrator scanning a roster of
   seven agents should not be looking at seven filled badges.

   ONE EXCEPTION, and it is the palette's own rule: a draft agent takes the
   accent, because a draft is the platform waiting on a decision that has not
   been made. Nothing else here does. */

export const AGENT_STATUS: Meaning<AgentStatus> = {
  active: { label: 'Active', tone: 'positive' },
  paused: { label: 'Paused', tone: 'caution' },
  draft: { label: 'Draft', tone: 'accent' },
}

export const VERDICT: Meaning<Verdict> = {
  pass: { label: 'Passed', tone: 'positive' },
  fail: { label: 'Failed', tone: 'critical' },
}

export const RUN_STATUS: Meaning<'completed' | 'escalated' | 'failed'> = {
  completed: { label: 'Completed', tone: 'positive' },
  escalated: { label: 'Escalated', tone: 'caution' },
  failed: { label: 'Did not finish', tone: 'critical' },
}

/* A required rule and an advisory one are not the same instrument, and an
   administrator adding a rule is choosing between them. Required is stated as
   brand ink — settled, non-negotiable — rather than as a warning colour. */
export const ENFORCEMENT: Meaning<Enforcement> = {
  required: { label: 'Required', tone: 'brand' },
  advisory: { label: 'Advisory', tone: 'neutral' },
}

export const INTEGRATION_STATUS: Meaning<'connected' | 'available' | 'attention'> = {
  connected: { label: 'Connected', tone: 'positive' },
  available: { label: 'Not connected', tone: 'neutral' },
  attention: { label: 'Needs attention', tone: 'caution' },
}

/* The five phases of a run's timeline, which are the five questions an
   administrator is actually asking of it. The labels are those questions,
   shortened — not internal phase names — because the timeline is read by someone
   checking what happened, not by someone who built it. */
export const RUN_STEP: Record<RunStepKind, { label: string; tone: Tone }> = {
  asked: { label: 'Asked to', tone: 'informative' },
  looked: { label: 'Looked at', tone: 'neutral' },
  acted: { label: 'Did', tone: 'brand' },
  produced: { label: 'Produced', tone: 'positive' },
  review: { label: 'Human review', tone: 'caution' },
}

/** Resolve any meaning to its chip classes in one step. */
export function chipFor(meaning: { tone: Tone }): string {
  return TONE[meaning.tone].chip
}

/* ───────────────────────────────────────────────────────────────────────────
   The client portal.

   Same discipline as everything above: a meaning maps to a tone, so restyling
   is one edit. The labels differ from the advisor-facing ones for the same
   reason the portal exists — "non_whitelisted" is the firm's word for a holding
   and "not on the firm's current list" is what it means to the person who owns it.
   ─────────────────────────────────────────────────────────────────────────── */

export const PLAN_HEALTH: Meaning<HealthStatus> = {
  on_track: { label: 'On track', tone: 'positive' },
  attention: { label: 'Needs attention', tone: 'caution' },
  off_track: { label: 'Off track', tone: 'critical' },
}

/* Five states, because "will it get there" has more than three useful answers.
   `no_target` is not a failure — it is a goal nobody has priced yet, and saying
   so is more useful than showing it at 0%. */
export const GOAL_STATE: Meaning<GoalStatus> = {
  ahead: { label: 'Ahead of target', tone: 'positive' },
  on_track: { label: 'On track', tone: 'positive' },
  slightly_short: { label: 'Slightly short', tone: 'caution' },
  short: { label: 'Short of target', tone: 'critical' },
  no_target: { label: 'No target set', tone: 'neutral' },
}

export const GOAL_KIND: Record<GoalKind, { label: string; Icon: typeof Info }> = {
  retirement: { label: 'Retirement', Icon: Landmark },
  education: { label: 'Education', Icon: GraduationCap },
  property: { label: 'Property', Icon: Home },
  legacy: { label: 'Legacy', Icon: Gift },
  liquidity: { label: 'Cash reserve', Icon: Wallet },
  other: { label: 'Other', Icon: Target },
}

export const LINK_STATUS: Meaning<InstitutionLinkStatus> = {
  connected: { label: 'Connected', tone: 'positive' },
  manual: { label: 'Added by you', tone: 'informative' },
  failed: { label: 'Could not connect', tone: 'critical' },
  pending: { label: 'Not connected yet', tone: 'neutral' },
}

export const ACTIVITY_KIND: Record<
  InvestorActivityKind,
  { label: string; Icon: typeof Info; tone: Tone }
> = {
  contribution: { label: 'Money in', Icon: TrendingUp, tone: 'positive' },
  withdrawal: { label: 'Money out', Icon: TrendingDown, tone: 'caution' },
  trade: { label: 'Trade', Icon: Repeat, tone: 'neutral' },
  dividend: { label: 'Income', Icon: Coins, tone: 'informative' },
  fee: { label: 'Fee', Icon: Receipt, tone: 'neutral' },
}

export const CHANGE_KIND: Record<
  InvestorChangeKind,
  { Icon: typeof Info; tone: Tone }
> = {
  moment: { Icon: BookMarked, tone: 'accent' },
  activity: { Icon: Coins, tone: 'informative' },
  account: { Icon: Landmark, tone: 'informative' },
  signature: { Icon: PenLine, tone: 'caution' },
  balance: { Icon: TrendingUp, tone: 'brand' },
  contribution: { Icon: CalendarClock, tone: 'caution' },
}

export const ESIGN_STATUS: Meaning<'awaiting_signature' | 'signed' | 'void'> = {
  awaiting_signature: { label: 'Waiting for you', tone: 'accent' },
  signed: { label: 'Signed', tone: 'positive' },
  void: { label: 'Withdrawn', tone: 'neutral' },
}
