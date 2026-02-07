# Style Guide

Rules for v0, Claude, and any AI assistant working on this codebase.

## Core Principle

The subtle thing that makes apps look good is removing everything that is not good. Unnecessary headers, titles, lines, colors. If it doesn't serve a clear purpose, cut it.

## Color

- Constrain colors so that when you do use one, it carries meaning.
- Gradients and color for no purpose makes everything noisy and sloppy.
- Never use Tailwind's `bg-gray` variants. They are actually blue. Prefer custom hex values.
- Use lighter colors on darker backgrounds to create hierarchy. Use shadows for depth.

## Typography

- No random fonts. No monospace just to look "techy". It looks sloppy.
- Never use unnecessary titles or headers. Before adding a title, ask: would someone put this kind of copy in a production app?

## Icons

- Use Lucide icons only. Never use emojis as icons.
- Use icons very sparingly. If icons are everywhere, they lose meaning.
- Avoid over-detailed or corny icons (robot icon, sparkle icon for AI, etc.).

## Animations

- Prefer no animations. If you must animate, use Framer Motion spring animations.
- Subtle spring animations at ~150ms duration. No plain ease-in or ease-out.
- Think through enter and exit states. The rest of the app must respond to layout changes consistently.

## Layout

- The viewport is the container. Content fills it. Never make a "mini app inside the website".
- Games, tools, and interactive views should be flush with the viewport.

## Dark Mode

- Prefer dark mode unless the user asks for light. Do not build dark/light toggle variants unless asked. One mode, tested well.

## Code Practices

- When removing code, never remove the import first. Remove the usage, then the import.
- This avoids intermediate errors that make real bugs harder to spot.

## Theme Tokens (CSS Variables)

```
--bg-primary: #060606
--bg-secondary: #0c0c0c
--bg-card: #111111
--bg-card-hover: #181818
--border-color: #1e1e1e

--accent-primary: #3b82f6 (use sparingly, only when color carries meaning)

--text-primary: #e8e8e8
--text-secondary: #777777
--text-muted: #444444
```

Background uses a subtle CSS grid pattern (1px lines at 2% white opacity, 60px spacing) to create texture without noise.
