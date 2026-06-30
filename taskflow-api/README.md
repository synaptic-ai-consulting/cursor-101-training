# TaskFlow API

> **Cursor Intermediate Intensive — Training Project**
> Node.js · TypeScript · Express · PostgreSQL · Jest

A task management REST API used as the running project throughout the Cursor Intermediate Intensive course. It is **intentionally incomplete** — students extend and fix it across 5 sessions.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 3. Set up the database
psql -U postgres -c "CREATE DATABASE taskflow;"
psql -U postgres -d taskflow -f src/db/schema.sql

# 4. Start development server
npm run dev

# 5. Run tests
npm test
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /health | Health check |
| GET | /tasks | List tasks (supports `?status=`, `?priority=`, `?project_id=`) |
| GET | /tasks/:id | Get task by ID |
| POST | /tasks | Create task |
| PATCH | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |
| GET | /projects | List projects |
| GET | /projects/:id | Get project by ID |
| POST | /projects | Create project |
| DELETE | /projects/:id | Delete project |
| GET | /users | List users (no passwords returned) |
| GET | /users/:id | Get user by ID |
| POST | /users | Create user |

---

## Project Structure

```
src/
  index.ts          # Entry point
  app.ts            # Express app setup
  types/            # Shared TypeScript interfaces
  db/               # PostgreSQL pool + schema.sql
  services/         # Business logic layer
  routes/           # Express route handlers
  middleware/       # Error handling + validation stubs
tests/
  unit/             # Service-layer unit tests (DB mocked)
  integration/      # Route integration tests (supertest)
```

Cursor rules live at the **workspace root** (parent of `taskflow-api/`):

```
../.cursor/
  rules/            # .cursor/rules — sparse stub for Session 1 lab
```

---

## What's Intentionally Incomplete (for training labs)

These gaps are features of the training design — not bugs to fix immediately.

| Location | What's missing | Fixed in |
|---|---|---|
| `routes/tasks.ts` | validate middleware not applied to POST | Session 1 Lab |
| `routes/projects.ts` | validate middleware not applied to POST | Session 1 Lab |
| `middleware/validate.ts` | TODO stubs inside validators | Session 1 Lab |
| `../.cursor/rules/project.mdc` | Sparse — needs full rules | Session 1 Lab |
| `tests/unit/taskService.test.ts` | TODO test stubs | Session 2 TDD Lab |
| `tests/integration/tasks.test.ts` | TODO test stubs | Session 2 TDD Lab |
| Auth routes | Not implemented | Session 5 Capstone |
| Search endpoint | Not implemented | Session 2 Agent Lab |
| Rate limiting middleware | Not implemented | Session 5 Mini-Capstone |

---

## Pre-Planted Bugs (Session 4 — Debugging Lab)

> **INSTRUCTOR ONLY — do not share with students before Session 4**

| # | File | Description | How to trigger |
|---|---|---|---|
| Bug 1 | `services/taskService.ts` `createTask` | Empty string title passes validation and inserts | `POST /tasks` with `{"title": ""}` |
| Bug 2 | `services/projectService.ts` `createProject` | Non-existent `owner_id` throws raw DB constraint error (not a 400) | `POST /projects` with a random UUID as `owner_id` |
| Bug 3 | `services/userService.ts` `createUser` | Invalid email format (e.g. `"notanemail"`) is accepted | `POST /users` with `{"name":"x","email":"notanemail","password":"123"}` |
| Bug 4 | `middleware/errorHandler.ts` `errorHandler` | Raw DB error messages (including table names, constraints) leak to client | Trigger any DB constraint violation |

---

## Session Labs Quick Reference

**Session 1:**
- Lab 1: Use `@docs` to import Express validation library docs; add validation to one endpoint
- Lab 2: Write a complete `.cursor/rules` at the workspace root (use `globs: taskflow-api/**` to scope rules to this project)

**Session 2:**
- Lab 1: Add a `GET /tasks/search?q=` endpoint using Agent Mode
- Lab 2: Write failing tests for the search feature, then use TDD + Agent Mode to implement it

**Session 3:**
- Build 4 Notepads: architecture decisions, API contract, DB schema, auth flow spec
- Use all 4 to add the `users` resource enhancements without re-explaining architecture

**Session 4:**
- Debug all 4 pre-planted bugs using the structured AI debugging loop
- Submit as a PR and use BugBot to review

**Session 5 (Capstone):**
- Add `POST /auth/register` and `POST /auth/login` with JWT
- Add `GET /tasks/search` with full test coverage
- Add rate-limiting middleware on all routes
