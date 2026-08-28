# yaUMS Frontend

**yet another User Management System** — a static, framework-free UI for the
yaUMS backend: users, groups, roles, permissions and audit logs, gated by
role-based access control.

## Stack

Plain HTML, CSS and vanilla JavaScript (ES modules) — **no build step, no
framework**. Every page is a real `.html` file that talks to the backend
REST API via `fetch`.

## Getting started

Make sure the backend is running first (see its README), then:

```bash
npm install
npm start   # serves this folder at http://localhost:5500
```

Open `http://localhost:5500` — it redirects to the login page, or straight
to Home if a session is already stored.

## Folder structure

```
pages/            one folder per screen: <name>.html + <name>.js controller
                   (+ *-table.render.js / *-form.render.js / *-dialog.js
                   helpers to keep each controller small). List screens have
                   a <name>-detail.html/.js sibling for the item detail view.
js/
  api/             thin fetch wrappers per resource, all going through
                   http-client.js (attaches the JWT, retries once on 401
                   via a silent refresh)
  auth/            session storage (localStorage) and the per-page guard
                   that redirects when unauthenticated or under-permissioned
  i18n/             translation loader + locale JSON files (en, pt-BR, es)
  theme/            light / dark / system switch, persisted in localStorage
  components/       sidebar, navbar, pagination, toasts, loading bar, the
                   generic create/edit dialog, the sortable-list
                   orchestrator and the detail-page relation widgets
assets/css/        small, static stylesheets — colors and layout only;
                   base.css holds the design tokens (color / radius / motion),
                   theme.css the dark palette overrides
config.js          API_BASE_URL
```

## Design system

The visual language is deliberately small and lives entirely in
`assets/css`. `base.css :root` defines the tokens — colour, `--radius`,
`--ease` and `--transition` — that every other sheet consumes. Buttons and
form controls (`select`, `input`) share one treatment: same border,
radius, hover and focus ring. Interaction feedback is kept light: a top
`loading-bar` while any request is in flight (`withLoading`), success /
error **toasts** on every write, and short 150–200 ms transitions. All
motion collapses under `prefers-reduced-motion`.

## Screens and behaviour

- The left sidebar hides behind an icon button; its **yaUMS wordmark is the
  Home link** (there is no dedicated Home menu item).
- Every list screen has **sortable column headers** — clicking a sortable
  header toggles `ASC`/`DESC` and re-queries with `sort` / `order`. Columns
  like *Actions* and *Description* are not sortable.
- Clicking a row's name opens its **detail page**: a User shows its groups
  and individual permissions, a Group its members and permissions, a Role
  its permissions — each with add/remove controls (system roles are
  read-only). The "add" picker stays hidden until you click the `+`
  button; only then does the select (plus confirm / cancel) appear.
- **Permissions** is a read-only catalogue — no create/edit/delete.
- The **theme switch** (light / dark / system) lives in the top bar and is
  only shown once signed in. Pre-auth screens just follow the resolved
  theme; on a first visit that resolves to the OS/browser preference.
- The sign-in screen links to the **forgot-password** flow: request a link,
  read it from the fake email service (backend logs), then set a new
  password on the reset screen.

## How permission-based UI works

After login the app calls `GET /auth/me`, which returns the actor's
resolved permission set (`grantsAll` flag plus a flat list of
`resource:action` strings). The sidebar filters its links against that
list — a Reader, for instance, never sees the Users/Groups/Roles/
Permissions/Audit Logs links because their role doesn't grant list-level
read access to those resources.

## i18n

All UI copy comes from `js/i18n/locales/<locale>.json`, looked up by key
(`t('users.title')`). The locale switcher in the top bar reloads the active
locale bundle and re-renders the page — no code ever contains translated
text directly.
