# Auth plan (frontend)

Login/JWT support for the RootAura UI. The backend half lives in
`../../backend/mongo-todo-app` — see its `docs/BACKLOG.md`
("Planned: JWT authentication & authorization").

Written 2026-11-02, updated 2026-11-02 with the file-by-file change plan. Tick boxes as you go.

## Current state (before this plan)

- `router/index.ts`: `/` uses `SettingsView` as the parent of `home`/`todos`/`settings`, but `SettingsView` has no `<router-view>`, so the children never render.
- `SettingsView.vue` doubles as the login form: submit only `console.log`s, field says "Username or Email" (backend only knows email), unrelated "Enable notifications" checkbox.
- No auth state — the only Pinia store is the template `stores/counter.ts` (unused).
- Every function in `services/todoServices/services.ts` calls `fetch` directly; no single place to attach `Authorization`. Several (`getTodos`, `getTodosDetails*`, `toggleTodoComplete`) parse the body without checking `response.ok`.
- `authServices/type.ts` `UsersDetails` has `password` (backend no longer returns it — `json:"-"`). `todoServices/type.ts` has an unused duplicate `User` with `name`, which doesn't match the backend's `first_name`/`last_name`.
- `<Alert>` is only rendered inside `Todos.vue`; `useAlert` state is global but nothing outside the todos page displays it.
- `FrontView.vue` is an empty file. `HomeView.vue` is already a working layout (header + `<router-view>`).

## Decisions

- **Token storage: `localStorage`** for now (testing phase). It's readable by JS (XSS risk). An httpOnly cookie is safer but needs backend changes (Set-Cookie, CSRF) — revisit before production.
- **Auto-login after register: yes.** `POST /users/create` returns no token, so the store calls `register()` then `login()` with the same credentials. If register succeeds but login fails → go to `/login` with the email pre-filled.
- **`VITE_AUTH_ENABLED` flag: pending.** See trade-offs below.

### `VITE_AUTH_ENABLED` trade-offs

Idea: the router guard only enforces `requiresAuth` when `VITE_AUTH_ENABLED === "true"`.

Pros
- Phase B (router + views) can merge before the backend login endpoint exists; the app stays usable with the flag off.
- Easy rollback: if login breaks, flip the flag instead of reverting code.
- Lets you work on todo UI locally without logging in every time.

Cons
- Vite inlines `VITE_*` at build time — changing it means rebuilding, not a runtime toggle.
- It's client-side only: anyone can bypass the guard anyway. Real protection is the backend middleware, so the flag gives a false sense of "auth off/on".
- Two code paths to test; easy to ship a build with the flag forgotten on `false`.
- Once the backend middleware is on, flag-off is broken (every request 401s), so the flag becomes dead weight and must be removed.

Alternative: skip the flag and just do Phase B after the backend login endpoint lands (the order below already allows that). Recommended if the backend step is close.

## Backend status

- [x] `GenerateToken` / `ValidateToken` in `services/authServices.go` (+ tests)
- [x] `JWT_SECRET` in `.env` / `Makefile`
- [x] `User.Password` hidden from responses; signup reads password via `createUserRequest`
- [ ] `GetUserByEmail`
- [ ] `POST /api/v1/auth/login`
- [ ] JWT middleware on protected routes
- [ ] Scope todos to the logged-in user

## API contract (agree before building Phase B)

```
POST /api/v1/auth/login   { email, password }
→ 200 { code: 200, data: { token, user: { id, first_name, last_name, email } } }
→ 401 { Msg: "invalid credentials", Code: 401 }

POST /api/v1/users/create { first_name, last_name, email, password }   (already exists)
→ 201 { Msg: "Successfully Created User", Code: 201 }
```

Protected requests send `Authorization: Bearer <token>`. A `401` means the token is missing, expired, or invalid.

## Phase A — groundwork (no backend needed, todos keep working)

### A1. `src/services/api.ts` (new) — one fetch wrapper
- [ ] `apiFetch<T>(path, init?)`: prefixes `VITE_API_URL`, sets `Content-Type: application/json` when there's a body, adds `Authorization: Bearer <token>` from the auth store when present
- [ ] On `!ok`: throw `new Error(body.Msg ?? fallback)`, safe for empty / non-JSON bodies
- [ ] On `401` for non-`/api/v1/auth/*` paths → call the registered unauthorized handler (a wrong password on login must not trigger logout/redirect)
- [ ] Export `setUnauthorizedHandler(fn)` — avoids `api.ts` importing the router (circular import)

### A2. `src/services/todoServices/services.ts`
- [ ] Switch all 10 functions to `apiFetch(...)`; drop repeated headers / `!response.ok` blocks. Signatures and return types unchanged, so `useTodo.ts` and components are untouched

### A3. Types
- [ ] `todoServices/type.ts`: delete the unused `User`
- [ ] `authServices/type.ts`: remove `password` from `UsersDetails`; add `AuthUser = Pick<UsersDetails, 'id' | 'first_name' | 'last_name' | 'email'>`, `LoginRequest`, `LoginResponse { token, user: AuthUser }`, `RegisterRequest`

### A4. `src/services/authServices/services.ts`
- [ ] Replace unused `getUsers` with `login(req)` → `POST /api/v1/auth/login` (returns `data`) and `register(req)` → `POST /api/v1/users/create`

### A5. `src/stores/auth.ts` (new), delete `stores/counter.ts`
- [ ] Setup store: `token`, `user` refs; `isAuthenticated = computed(() => !!token.value)`
- [ ] `login(email, password)` → service → state + `localStorage` (key `rootaura.auth`)
- [ ] `register(req)` → `registerService(req)` then `login(req.email, req.password)` (auto-login)
- [ ] `logout()` → clear state + storage
- [ ] Hydrate from storage in `try/catch`; missing/broken value → logged out
- [ ] Optional: decode JWT `exp`, treat expired as logged out

### A6. `src/App.vue`
- [ ] Mount `<Alert>` here (bound to `useAlert()`); remove it from `Todos.vue`

### A7. `src/main.ts`
- [ ] After `app.use(router)`: `setUnauthorizedHandler(() => { useAuthStore().logout(); router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } }) })`

## Phase B — routes & views (needs the backend login endpoint)

### B1. `src/router/index.ts`
- [ ] Restructure:
  ```
  /login            name:login     LoginView     meta.guestOnly
  /register         name:register  RegisterView  meta.guestOnly
  /                 HomeView (layout)            meta.requiresAuth
    ├ ""            → redirect /todos
    ├ todos         name:todos     TodosView
    └ settings      name:settings  SettingsView
  /detailTodos      name:detail    UserView      meta.requiresAuth
  /:pathMatch(.*)*  → redirect /todos
  ```
- [ ] `beforeEach`: `to.matched.some(r => r.meta.requiresAuth)` && not logged in → `{ name: 'login', query: { redirect: to.fullPath } }`; `guestOnly` && logged in → `/todos`
- [ ] Drop the `home` child (HomeView is the layout)
- [ ] If the flag is adopted: guard only enforces when `VITE_AUTH_ENABLED === "true"`

### B2. `src/views/LoginView.vue` (new)
- [ ] Form moved out of `SettingsView`: `email` (`type="email"`, required) + `password`
- [ ] `loading` ref disables submit; `auth.login()`; errors via `showError(e.message)`
- [ ] Success → `route.query.redirect ?? '/todos'`; pre-fill email from `route.query.email`
- [ ] Link to `/register`

### B3. `src/views/RegisterView.vue` (new)
- [ ] First name, last name, email, password, confirm password (client-side match check)
- [ ] `auth.register()` → auto-login → `/todos` with `showSuccess`
- [ ] Register OK but login fails → `/login?email=...` with an info alert

### B4. `src/views/SettingsView.vue`
- [ ] Read-only profile card from `auth.user` (name, email) + notifications toggle (local only for now); login form removed

### B5. `src/views/HomeView.vue`
- [ ] Logout button in desktop + mobile menu → `auth.logout()` → `/login`
- [ ] Optional: show `auth.user.first_name` in the header

### B6. Cleanup
- [ ] Delete `FrontView.vue`
- [ ] If the flag is adopted: add `VITE_AUTH_ENABLED` to `.env.example`

## Order across both repos (so nothing breaks)

1. Frontend: Phase A (can start now — routes still public, todos keep working)
2. Backend: `GetUserByEmail` + login endpoint (no middleware yet)
3. Frontend: Phase B
4. Backend: enable the JWT middleware. The UI already sends the token
5. Backend: scope todos per user. No frontend change needed

Suggested commits: (1) `api.ts` + service migration, (2) types + auth service + store, (3) `Alert` → `App`, (4) router + guard, (5) Login/Register views, (6) Settings/Logout/cleanup.

## Verification

- `npm run type-check` and `npm run build` after each phase
- After Phase A: list / create / edit / toggle / delete / details still work
- Wrong password → alert, stays on `/login`; good login → redirect, `rootaura.auth` in `localStorage`
- Register → lands on `/todos` already logged in
- Refresh keeps the session; Logout clears storage and `/todos` redirects to `/login`
- Corrupt or expired token in storage → lands on `/login` without crashing
- After middleware: a 401 from a todo call logs out and redirects back with `?redirect=`
