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
                   helpers to keep each controller small)
js/
  api/             thin fetch wrappers per resource, all going through
                   http-client.js (attaches the JWT, retries once on 401
                   via a silent refresh)
  auth/            session storage (localStorage) and the per-page guard
                   that redirects when unauthenticated or under-permissioned
  i18n/             translation loader + locale JSON files (en, pt-BR, es)
  components/       sidebar, navbar, pagination, toasts, the generic
                   create/edit dialog used by every CRUD page
assets/css/        small, static stylesheets — colors and layout only
config.js          API_BASE_URL
```

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
