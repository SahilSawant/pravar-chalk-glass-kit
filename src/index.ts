// Buttons, fields, avatars, chips, tabs, skeletons, tooltips, toasts, tables.
export {
  Button,
  Field,
  inputClass,
  Avatar,
  FilterChip,
  Chip,
  Tabs,
  Skeleton,
  SkeletonRows,
  Tooltip,
  useToast,
  ToastProvider,
  CELL_PAD,
  Table,
  useDensity,
} from './components/primitives'
export type { ButtonVariant, ButtonSize } from './components/primitives'

// Spinners, error/empty states, cards, page chrome, modals and drawers.
export { Spinner, ErrorState, EmptyState, Card, PageHeader, Badge, Modal, Drawer, Markdown, Stat } from './components/ui'

// Popover menu.
export { Dropdown } from './components/Dropdown'

// Charts.
export { BandScale } from './components/charts/BandScale'
export type { BandScaleRisk } from './components/charts/BandScale'
export { IdealBar } from './components/charts/Bar'
export type { IdealRow } from './components/charts/Bar'
export { Donut, MiniDonut } from './components/charts/Donut'
export type { AssetSlice } from './components/charts/Donut'

// Semantic vocabulary — meanings, tones and the chips built from them.
export {
  chipBase,
  CHIP,
  TONE,
  RELATIONSHIP_STATUS,
  MOMENT,
  TRIGGER,
  CONTROL_TOWER_ITEM,
  PLANNING_DOMAIN,
  PLANNING_PRIORITY,
  PRIORITY,
  SEVERITY,
  RISK_VERDICT,
  COMPLIANCE,
  HOUSE_VIEW_STATUS,
  HOUSE_VIEW_CHIP,
  RISK_BAND,
  AGENT_STATUS,
  VERDICT,
  RUN_STATUS,
  ENFORCEMENT,
  INTEGRATION_STATUS,
  RUN_STEP,
  chipFor,
  PLAN_HEALTH,
  GOAL_STATE,
  GOAL_KIND,
  LINK_STATUS,
  ACTIVITY_KIND,
  CHANGE_KIND,
  ESIGN_STATUS,
} from './lib/semantics'
export type {
  Tone,
  RelationshipStatus,
  MomentType,
  TriggeredBy,
  ControlTowerItemType,
  PlanningDomain,
  PlanningPriority,
  ControlTowerPriority,
  AgentStatus,
  Verdict,
  Enforcement,
  RunStepKind,
  HealthStatus,
  GoalStatus,
  GoalKind,
  InstitutionLinkStatus,
  InvestorActivityKind,
  InvestorChangeKind,
} from './lib/semantics'

// Formatting helpers.
export { formatMoney, formatDate, relativeTime, initials, formatDateTime } from './lib/format'
