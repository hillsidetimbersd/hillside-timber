# Custom Project Form — Design Spec
**Date:** 2026-04-19
**Project:** Hillside Timber / Sioux Falls Woodworking
**Component:** `CustomProjectDrawer`

---

## Overview

Replace the current single-scroll inquiry form with a premium 3-step wizard drawer. The goal is twofold: give Slavic's team complete, structured information on every submission so they spend zero time chasing details, and give the client an experience that feels as intentional and handcrafted as the furniture itself.

---

## Architecture

The drawer stays as a fixed right-panel slide-in (480px wide). The form state lives in a single `useReducer` hook. Step navigation is local state. File uploads go to Supabase Storage (`inquiry-photos` bucket, public read). The existing `/api/inquiry` route handler gets extended with new fields.

**New component:** `CustomProjectDrawer` is refactored from a single form into a step controller that renders one of three step components:

- `StepOne` — About You
- `StepTwo` — Your Project
- `StepThree` — Details

**Shared UI atoms (new):**
- `ProgressBar` — three-segment bar at the top of the drawer
- `LineArtCard` — selectable card with SVG line art icon + label
- `ChipSelector` — square-corner chip group (single or multi-select)
- `DropZone` — drag-and-drop file upload with thumbnail grid

---

## Progress Bar

Three segments at the top of the drawer header, below the title. Labels: "You" / "Project" / "Details."

- Completed steps: solid green fill
- Active step: partially filled (50%) green
- Remaining steps: empty, gray border

No step numbers visible on the bar itself — the labels are enough.

---

## Step 1: About You

**Fields:**

| Field | Type | Required | Validation |
|---|---|---|---|
| Your Name | Text input | Yes | Non-empty |
| Email | Email input | Yes | Valid email format |
| Phone | Tel input | No | If entered: 10 digits minimum |
| Zip Code | Text input | Yes | Exactly 5 digits |
| Delivery Method | `LineArtCard` group | Yes | Single select |

**Delivery Method cards (3):**

- **Pickup** — line art: a door/entrance icon. Label: "Pickup." Sub-label: "Come to our Sioux Falls shop."
- **Local Delivery** — line art: a van/truck icon. Label: "Local Delivery." Sub-label: "Sioux Falls area."
- **Nationwide Freight** — line art: a freight/box icon. Label: "Nationwide Freight." Sub-label: "We ship anywhere."

Cards sit in a horizontal row of three, equal width. Selecting one highlights it with a green border and fills the icon stroke green. No mention of freight pricing in the form itself — that comes in the quote.

---

## Step 2: Your Project

**Fields:**

### Project Type (required, single select)
`LineArtCard` grid — 4 columns, 2 rows.

| Label | SVG subject |
|---|---|
| Dining Table | Table with 4 legs |
| Coffee Table | Low table with 4 legs |
| Bench | Plank with 2 legs |
| Shelf | Bookcase outline |
| Mantel | Fireplace surround |
| Desk | L-shaped desk with return |
| Bed Frame | Headboard + frame |
| Other | Plus/asterisk mark |

Selecting "Other" reveals a text input beneath the grid, labeled "What are you building?" (required if Other is selected).

### Wood Species (required, multi-select, at least one)
`ChipSelector` — square-corner chips in a flowing wrap layout.

Options: Walnut, White Oak, Cherry, Maple, Ash, Pine, Cedar, Not Sure.

Behavior: selecting "Not Sure" makes it the only active selection. Selecting any named species automatically deselects "Not Sure" and adds the species. Users can freely switch between the two modes.

### Finish Preference (required, single select)
`ChipSelector` — same style as species.

Options: Natural / Raw, Matte Oil, Satin Lacquer, Semi-Gloss, Painted, Not Sure.

### Dimensions (optional)
Three side-by-side numeric inputs: **L**, **W**, **H**. A small toggle to the right switches the unit label between **in** and **cm** (default: in). The unit selection applies to all three fields.

Field label: "Dimensions" with subtext: "Helps us quote accurately — your best estimate is fine."

---

## Step 3: Details

**Fields:**

### Budget Range (required, single select)
`ChipSelector` — square chips.

Options: Under $1,000 / $1,000–$3,000 / $3,000–$6,000 / $6,000–$12,000 / $12,000+

### Timeline (required, single select)
`ChipSelector` — square chips.

Options: As Soon As Possible / Within 3 Months / 3–6 Months / 6+ Months / No Rush

### Inspiration Photos (optional)
`DropZone` — full zone style.

- Large dashed-border zone with a line-art image icon, primary text "Drop photos here," and a "browse files" link fallback
- Accepts JPG, PNG
- Up to 5 files, 10MB each
- After drop: zone collapses to a smaller "Add more" row, thumbnails appear in a 3-column grid below with individual remove (X) buttons
- Label above the zone: "Inspiration photos"
- Subtext: "Drop photos of your space, inspiration pieces, or style references."
- Upload happens on form submit, not on drop. Files are held in state as `File` objects until submission.

### Your Vision (required)
Generous `textarea`, min 20 characters.

**Label:** "Your vision, your way."

**Placeholder / subtext beneath label:** *"Share anything — a sketch, a vibe, a Pinterest board description, how the piece will be used, what matters most to you. We read every word and love to collaborate to make this exactly right."*

The subtext appears as italic body copy below the label, above the input — not inside the input as a placeholder. The textarea itself has a simple placeholder: "Tell us everything..."

---

## Navigation

- **Step 1 footer:** Next button (right-aligned). No back button.
- **Step 2 footer:** Back (ghost, left) + Next (primary, right).
- **Step 3 footer:** Back (ghost, left) + "Send Project Request" (primary, right).
- Next validates only the current step's required fields before advancing.
- Back never validates — always allows going back.

---

## Success Screen

Replaces the form body after successful submission.

**Icon:** Green checkmark (Phosphor `CheckCircle`, weight `light`, 64px)

**Heading:** "We've got your project."

**Body:** *"Slavic reviews every request personally and will be in touch within 1–2 business days. We love what we do — let's build something great together."*

**Button:** "Close" (ghost)

---

## Error Handling

- Inline validation on Next/Submit click — fields show a red border + human-readable message below (not a generic "required" label).
- Examples: "Please enter a valid email address." / "Zip code must be 5 digits." / "Pick at least one wood species." / "Tell us a bit more — at least a sentence."
- If the API call fails: a non-blocking error bar appears above the Submit button. "Something went wrong — please try again or email us directly." (link the business email from the site's contact config — confirm the address before implementation) Retry is possible without losing form data.
- File upload failures are handled per-file: the thumbnail shows a red overlay with a retry icon.

---

## API Changes

### `/api/inquiry` route — new fields

```
zip_code: string
delivery_method: "pickup" | "local" | "nationwide"
project_type: string
species_preference: string[]       // was a single string
finish_preference: string
dimensions: { l: string; w: string; h: string; unit: "in" | "cm" } | null
photo_urls: string[]               // Supabase Storage URLs
description: string                // now "vision" field
```

### Supabase `inquiries` table — new columns

```sql
alter table inquiries
  add column zip_code text,
  add column delivery_method text,
  add column finish_preference text,
  add column photo_urls text[],
  add column dimensions jsonb;

-- species_preference changes from text to text[]
alter table inquiries
  alter column species_preference type text[]
  using case when species_preference is null then null else array[species_preference] end;
```

### Supabase Storage

New bucket: `inquiry-photos` (public read, authenticated write via service role).
Path pattern: `inquiries/{timestamp}-{random}/{filename}`

---

## Component File Plan

```
src/components/inquiry/
  CustomProjectDrawer.tsx      (refactored — step controller only)
  StepOne.tsx
  StepTwo.tsx
  StepThree.tsx
  ProgressBar.tsx
  LineArtCard.tsx
  ChipSelector.tsx
  DropZone.tsx
  SuccessScreen.tsx
```

---

## Out of Scope

- Freight cost estimation in the form
- Email notification to Slavic on submission (existing behavior unchanged)
- Admin view of submissions
- Photo compression client-side
