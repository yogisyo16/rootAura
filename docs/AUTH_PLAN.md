# Auth plan (frontend)

Login/JWT support for the UI. The backend half lives in
`../../backend/mongo-todo-app` — see its `docs/BACKLOG.md`
("Planned: JWT authentication & authorization").

Written 2026-11-02. Tick boxes as you go.

## Current state (before this plan)

- `router/index.ts`: `/` uses `SettingsView` as the parent of `home`/`todos`/`settings`, but `SettingsView` has no `<router-view>`, so the children never render.
- `SettingsView.vue` doubles as the login form: submit only `console.log`s, field says "Username or Email" (backend only knows email), unrelated "Enable notifications" checkbox.
- No auth state — the only Pinia store is the template `stores/counter.ts`.
- Every function in `services/todoServices/services.ts` calls `fetch` directly; no single place to attach `Authorization`.
- `authServices/type.ts` `UsersDetails` has `password` (backend no longer returns it — `json:"-"`). `todoServices/type.ts` has a duplicate `User` with `name`, which doesn't match the backend's `first_name`/`last_name`.

## Backend status

- [x] `GenerateToken` / `ValidateToken` in `services/authServices.go` (+ tests)
- [x] `JWT_SECRET` in `.env` / `Makefile`
- [x] `User.Password` hidden from responses; signup reads password via `createUserRequest`
- [ ] `GetUserByEmail`
- [ ] `POST /api/v1/auth/login`
- [ ] JWT middleware on protected routes
- [ ] Scope todos to the logged-in user

## API contract (agree before building step 2)

```
POST /api/v1/auth/login   { email, password }
→ 200 { code: 200, data: { token, user: { id, first_name, last_name, email } } }
→ 401 { Msg: "invalid credentials", Code: 401 }

POST /api/v1/users/create { first_name, last_name, email, password }   (already exists)
→ 201 { Msg: "Successfully Created User", Code: 201 }
```

Protected requests send `Authorization: Bearer <token>`. A `401` means the token is missing, expired, or invalid.

## Steps

### 1. `src/services/api.ts` — one fetch wrapper
- [ ] `apiFetch(path, options)`: prefixes `VITE_API_URL`, sets `Content-Type: application/json`, adds `Authorization: Bearer <token>` when present
- [ ] On `401` → `auth.logout()` + redirect to `/login`
- [ ] Switch every call in `todoServices/services.ts` from `fetch(\`${apiUrl}...\`)` to `apiFetch(...)` (signatures unchanged)

### 2. Auth service — `src/services/authServices/`
- [ ] `services.ts`: `login(email, password)`, `register({ first_name, last_name, email, password })`; drop `getUsers` unless needed
- [ ] `type.ts`: `LoginRequest`, `LoginResponse`, `RegisterRequest`; remove `password` from `UsersDetails`
- [ ] Delete the duplicate `User` in `todoServices/type.ts`

### 3. Pinia store — `src/stores/auth.ts`
- [ ] Replace `stores/counter.ts`
- [ ] State: `token`, `user`; computed `isAuthenticated`; actions `login()`, `logout()`
- [ ] Persist to `localStorage` so refresh keeps you logged in. Wrap reads in `try/catch`, treat a missing or broken value as logged out
- Trade-off noted: `localStorage` is readable by JS (XSS risk). An httpOnly cookie is safer but needs backend changes (Set-Cookie, CSRF) — deferred

### 4. Router — `src/router/index.ts`
- [ ] Restructure:
  ```
  /login       → LoginView        (public)
  /register    → RegisterView     (public)
  /            → HomeView layout  (meta: { requiresAuth: true })
    ├ ""         → redirect /todos
    ├ todos      → TodosView
    └ settings   → SettingsView
  /detailTodos → UserView         (requiresAuth)
  ```
- [ ] `router.beforeEach`: `requiresAuth` && not logged in → `/login`; logged in && going to `/login` → `/todos`

### 5. Views
- [ ] `LoginView.vue` (new): move the form out of `SettingsView`. Email field (`type="email"`), no checkbox, calls `auth.login()`, errors via `useAlert`, success → `/todos`
- [ ] `RegisterView.vue` (new): first/last name, email, password → `register()` → `/login` (or auto-login)
- [ ] `SettingsView.vue`: back to a real settings page (notifications toggle lives here)
- [ ] `HomeView.vue`: Logout button in desktop + mobile menu → `auth.logout()` → `/login`

## Order across both repos (so nothing breaks)

1. Backend: `GetUserByEmail` + login endpoint (no middleware yet)
2. Frontend: steps 1–5 above. Todos keep working since routes are still public
3. Backend: enable the JWT middleware. The UI already sends the token
4. Backend: scope todos per user. No frontend change needed
