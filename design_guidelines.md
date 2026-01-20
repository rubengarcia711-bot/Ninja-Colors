# Design Guidelines: Ninja Kids vs Brainrot Coloring App

## Design Approach: Playful Creative Experience

**Primary References:** Toca Boca apps, PBS Kids Games, Procreate Pocket
**Core Principle:** Fun, intuitive, child-friendly interface with energetic ninja theme meets internet culture humor

## Typography

**Headings:** Rounded, bold sans-serif (Comic Neue, Nunito, or Fredoka)
- Hero titles: text-4xl to text-6xl, font-black
- Section headers: text-3xl, font-bold
- Card titles: text-xl, font-bold

**Body Text:** Clear, readable (Nunito, Inter)
- Primary text: text-lg
- Secondary text: text-base
- All text should have high contrast for readability

## Layout System

**Spacing Units:** Tailwind units of 3, 4, 6, 8, 12
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-16
- Gap between elements: gap-4 to gap-6

**Container Structure:**
- Max width: max-w-6xl for content
- Full-width colorful backgrounds with contained content
- Mobile-first: Single column, desktop: 2-3 column grids

## Core Components

**Navigation:**
- Fixed header with large, chunky buttons
- Burger menu for mobile with oversized touch targets
- Navigation items: px-6 py-3, rounded-xl

**Coloring Page Gallery:**
- Masonry grid layout (2 cols mobile, 3-4 cols desktop)
- Large preview thumbnails with character illustrations
- Cards: rounded-2xl, shadow-lg, hover lift effect
- "NEW" badges on fresh content

**Coloring Canvas Interface:**
- Full-screen workspace with minimal chrome
- Large color palette (min 48px color swatches)
- Tool selector with icon buttons (64px minimum)
- Floating undo/redo/clear controls
- Bottom drawer for color picker

**Character Selection:**
- Horizontal scrolling carousel
- Ninja characters vs Brainrot villains showcase
- Character cards: w-48, rounded-3xl
- Name tags below each character

**CTA Buttons:**
- Oversized: px-8 py-4, rounded-full
- Font: text-xl, font-bold
- Prominent placement with generous spacing

## Images

**Hero Section:**
- Large, vibrant illustration showing ninja kids in action poses fighting humorous brainrot characters
- Playful, cartoon style with bold outlines
- Image should convey energy and fun
- Placement: Full-width background with overlaid content

**Character Thumbnails:**
- Individual character portraits for selection
- Both ninja kids and brainrot villain varieties
- Consistent illustration style throughout

**Sample Coloring Pages:**
- Preview images showing completed colored versions
- Before/after examples to inspire creativity

**Background Elements:**
- Comic-style action bursts, stars, motion lines as decorative elements

## Special Features

**Gamification Elements:**
- Achievement badges (stickers earned)
- Progress tracker showing completed pages
- "Collection" view with all unlocked pages

**Interactive Elements:**
- Tap-based color fill
- Brush size slider with visual preview
- Sparkle/confetti animation on page completion
- Sound effects toggle (optional audio feedback)

**Parent Section:**
- Dedicated "Parents" page with safety info
- Print-friendly export options
- Save/share gallery

## Page Structure

**Landing Page:**
1. Hero: Energetic ninja kids illustration with "Start Coloring!" CTA
2. Featured Characters: Scrolling showcase of ninja kids and brainrot villains
3. How It Works: 3-step visual guide (Choose → Color → Share)
4. Sample Gallery: Grid of completed coloring pages
5. Download/Access CTA

**App Interface:**
- Character browser (grid view)
- Coloring workspace (full-screen)
- Gallery (completed works)
- Settings (simple, child-safe)

## Design Principles

- **Large Touch Targets:** Minimum 48px for all interactive elements
- **High Contrast:** Ensure text readability for young users
- **Playful Shapes:** Rounded corners everywhere (rounded-xl to rounded-3xl)
- **Visual Feedback:** Immediate response to all interactions
- **No Small Text:** Minimum text-base, prefer text-lg
- **Clear Hierarchy:** Bold headings, obvious buttons
- **Forgiving Interface:** Easy undo, no destructive actions without confirmation