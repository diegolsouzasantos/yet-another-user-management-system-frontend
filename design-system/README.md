# yaUMS Design System

The small, buildless design layer the yaUMS frontend is built on. It is a plain
folder of CSS and ES modules — no package, no bundler — loaded directly by the
pages via `<link>` and `import`. It satisfies requirements **4.3.5** (design
system: tokens, icons, interaction components) and **6.3** (its own living
documentation).

Open [`styleguide.html`](./styleguide.html) in the running frontend
(`/design-system/styleguide.html`) for the visual reference.

## What's in here

| File | Purpose |
|---|---|
| `design-system.css` | Layout/elevation/spacing/z-index tokens on top of the color & radius tokens in `assets/css/base.css` + `theme.css`; styles for the interaction components below. |
| `icons.js` | The icon set. `iconEl(name, { size })` returns an `<svg>` node, `iconSvg(name)` returns markup. Stroke icons on a 24×24 grid, `currentColor`. |
| `menu.js` | `attachMenu(triggerEl, items)` — a dropdown menu opened from a trigger button. `items` is an array (or a function returning one) of `{ label, icon?, onSelect, variant? }` or `{ separator: true }`. Closes on select, outside click, `Esc`, scroll or resize. One menu open at a time. |
| `modal.js` | `openModal({ title, message, content?, confirmLabel, cancelLabel, variant })` → `Promise<boolean>`. Native `<dialog>` with a dimmed, blurred backdrop. `confirmModal` is an alias. |

## Tokens

Colours, `--radius`, `--transition`, `--ease` live in `assets/css/base.css`
(light) and `assets/css/theme.css` (dark / system). This folder adds:

- **Spacing** — `--space-1` … `--space-6` (0.25rem → 2rem)
- **Elevation** — `--shadow-1` (resting), `--shadow-2` (menus, modals)
- **Stacking** — `--z-menu` (60), `--z-modal` (80)
- **Icon size** — `--ds-icon-size` (18px default)

## Component patterns

- **Generic action buttons are icon + label** (req 4.3.6). Put an `iconEl(...)`
  before the text span inside a `.btn`. "Create" and "Add sub-record" use the
  `plus` icon.
- **Per-row list actions** (Edit / Delete) are not loose buttons: a single
  `.ds-icon-btn` with the `ellipsis` icon opens a `menu.js` menu, one item per
  action, each with its own icon (`pencil`, `trash` as `variant: 'danger'`).
- **Preferences** (theme + language) sit behind one `.ds-icon-btn` with the
  `sliders` icon in the top-right of the authenticated shell; the menu holds the
  two selects and closes on outside click.
- **Confirmations that must interrupt** (delete, ownership transfer) use
  `modal.js` so the rest of the page is dimmed and inert.
- **Permission origin** is shown with `.ds-badge--role` / `--group` / `--direct`.

## Adding an icon

Add one entry to `PATHS` in `icons.js`: the inner SVG markup (paths/circles),
authored on the 24×24 grid, no `fill`/`stroke` attributes (the wrapper sets
`stroke: currentColor`). It shows up in the styleguide automatically.
