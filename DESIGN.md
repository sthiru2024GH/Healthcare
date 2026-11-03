---
name: Clinical Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006577'
  on-tertiary: '#ffffff'
  tertiary-container: '#008096'
  on-tertiary-container: '#f9fdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-metric:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets healthcare practitioners, clinical administrators, and patients requiring clear, immediate health information. The core personality is precise, calm, authoritative, and frictionless. The interface must inspire absolute trust, operational security, and regulatory rigor without feeling cold or sterile.

The aesthetic blends **Modern Corporate** clarity with **Refined Clinical Minimalism**. It eliminates visual noise, excessive decoration, and aggressive saturation in favor of structural order, surgical alignment, and high data legibility. Micro-interactions should be deliberate and damped, conveying stability, privacy, and clinical assurance across dense diagnostic workflows and patient summaries.

## Colors

The palette balances clinical precision against readable contrast to guarantee AA/AAA compliance across all interactive and static elements:

- **Primary (`#0D9488` - Clinical Teal):** Anchors primary actions, confirmed interactive states, and trusted navigational cues.
- **Secondary (`#0F172A` - Deep Navy Slate):** Establishes solid structural contrast, driving primary typography, persistent navigational chrome, and key modal headings.
- **Tertiary (`#06B6D4` - Warm Cyan):** Highlights ongoing telemetry, active patient tracking metrics, subtle focus indicators, and supportive interactive accents.
- **Neutral Surface (`#F8FAFC` - Ice Slate):** Provides the soothing, glare-free foundational canvas for dense analytical dashboards and medical charts.

### Supportive Functional Tones
- **Subtle Emerald (`#10B981` / background `#ECFDF5`):** Reserved strictly for normal telemetry, valid HIPAA verifications, and resolved conditions.
- **Amber Warning (`#F59E0B` / background `#FFFBEB`):** Flags pending approvals, scheduled lab updates, or triage level 3.
- **Critical Crimson (`#EF4444` / background `#FEF2F2`):** Communicates abnormal lab values, life-safety alerts, and system-level exceptions.
- **Borders & Dividers (`#E2E8F0`):** Provides delicate containment without competing with diagnostic data.

## Typography

Typography relies on a paired hierarchy: **Plus Jakarta Sans** delivers warmth, approachable authority, and clean humanist geometry for headers and body narrative, while **Inter** governs high-density clinical data, metadata tags, metric readouts, and status badges.

Tabular figures (`font-variant-numeric: tabular-nums`) must be enabled on all numerical observations, timestamps, and patient vital displays to prevent layout jitter during live updates.

## Layout & Spacing

The layout is built on an adaptive 12-column grid prioritizing data density without visual clutter:

- **Desktop (1280px+):** 12-column layout, 32px (`margin`) page gutters, 24px (`gutter`) column gaps. Maximum content envelope capped at 1440px for single-focus clinical records; full-bleed fluid grid permitted for multi-pane telemetry boards.
- **Tablet (768px - 1279px):** 8-column layout, 24px outer margin, 16px gutter. Side-by-side diagnostic views collapse into tiered master-detail modules.
- **Mobile (<768px):** 4-column layout, 16px (`margin-sm`) outer margin, 16px (`gutter-sm`) gutter. Action bars and critical patient alert switches pin to bottom safe-area perimeters.

Spacing follows an uncompromising 4px/8px rhythm. Compact spacing (`space-xs` and `space-sm`) handles internal card metrics and list metadata; generous spacing (`space-lg` and `space-xl`) isolates separate patient record panels.

## Elevation & Depth

To preserve clinical focus and ensure predictable contrast on medical-grade displays, this design system minimizes heavy dropshadows. Depth relies on **tonal elevation layers** paired with **low-contrast precision borders**:

- **Ground Level (Base Canvas):** `#F8FAFC` solid fill.
- **Level 1 (Cards, Tables, Panels):** `#FFFFFF` pure white surface bounded by a crisp `1px solid #E2E8F0` border. Ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Hover States, Floating Action Panels, Flyouts):** `#FFFFFF` with `1px solid #CBD5E1`. Shadow: `0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Diagnostic Overlays, Critical Interventions):** `#FFFFFF` with `1px solid #94A3B8`. Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`. Backdrop utilizes `#0F172A` with a 45% alpha channel and `backdrop-filter: blur(4px)`.

## Shapes

The design system enforces a calibrated balance: geometric enough to communicate enterprise reliability, yet gently curved to prevent harsh clinical austerity:

- **Base Radius (`0.5rem` / 8px):** Standard interactive surfaces including text inputs, standard buttons, tabular cards, and alert boxes.
- **Large Radius (`1rem` / 16px):** Outer wrappers of primary patient summary cards, diagnostic view containers, and floating modal sheets.
- **Extra-Large Radius (`1.5rem` / 24px):** Specialty onboarding cards and contextual dashboard banners.
- **Full Radius (Pill):** Strictly reserved for status badges, filter chips, vital trend tags, and avatar frames.

## Components

### Buttons
- **Primary:** Solid `#0D9488` fill, `#FFFFFF` text, `0.5rem` radius. Subtle hover shift to `#0F766E`. Active: `#115E59`. Focus ring: 2px offset with `#06B6D4`.
- **Secondary:** `#FFFFFF` fill with `1px solid #E2E8F0`, `#0F172A` text. Hover: `#F8FAFC` background with `#CBD5E1` border.
- **Destructive/Emergency:** `#EF4444` fill, `#FFFFFF` text. Used exclusively for revoking access, critical data overrides, or unrecoverable record changes.
- **Heights:** 40px standard, 32px compact (table actions), 48px prominent (touch/mobile viewports).

### Form Inputs & Selects
- Background: `#FFFFFF`. Border: `1px solid #CBD5E1`. Radius: `0.5rem`.
- Typography: `body-md` in `#0F172A`. Placeholder: `#94A3B8`.
- Focus State: Border transitions to `#0D9488` accompanied by a `0 0 0 3px rgba(13, 148, 136, 0.15)` focus ring.
- Error State: Border shifts to `#EF4444` with validation text rendered directly below using `label-md`.

### Status Badges & Chips
- Form Factor: Pill-shaped (`rounded-full`), height 24px, horizontal padding `space-sm` (8px). Text: `label-sm` uppercase tracking.
- **Stable / Normal:** Emerald text (`#047857`) on `#ECFDF5` background, `1px solid #A7F3D0`.
- **Monitoring / Active:** Cyan text (`#0E7490`) on `#ECFEFF` background, `1px solid #A5F3FC`.
- **Review Required:** Amber text (`#B45309`) on `#FFFBEB` background, `1px solid #FDE68A`.
- **Critical / Elevated:** Red text (`#B91C1C`) on `#FEF2F2` background, `1px solid #FECACA`.

### Cards & Data Containers
- White `#FFFFFF` surface bounded by `1px solid #E2E8F0` and `rounded-lg` (16px) perimeter.
- Split layout: Header row features `title-md` text and right-aligned action chips, separated from the content body by a subtle `1px solid #F1F5F9` rule.

### Checkboxes & Radios
- Size: 18px x 18px. Border: `1.5px solid #94A3B8`.
- Checked State: Solid `#0D9488` with `#FFFFFF` checkmark/indicator dot.
- Focus: Offset outline with `#06B6D4`.

### Healthcare-Specific Components
- **HIPAA Verification Banner:** Pinned top or bottom bar displaying active encryption state, audit ID, and session timer in `#0F172A` with `#0D9488` badge indicator.
- **Vital Sign Micro-Tile:** Compact card showcasing metric value in `data-metric`, contextual unit in `label-sm`, and an inline trend arrow indicating stability or variance.