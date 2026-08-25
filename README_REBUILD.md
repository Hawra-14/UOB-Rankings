# UoB Rankings — Rebuild (FastAPI + HTML/CSS/JS)

This README documents the requirements, architecture, data model, workflows, API surface, UI pages, security considerations, testing, deployment, and a concrete development plan for rebuilding the UoB Rankings project using FastAPI (Python) for the backend and HTML/CSS/JavaScript for the frontend.

Purpose and goals
- Replace the existing Turso/Node.js setup with a maintainable, secure, and testable Python backend (FastAPI) and an accessible web frontend (server-rendered templates + progressive enhancement).
- Provide role-based access control, full audit trails, a robust submission -> review -> publish workflow, and a deterministic scoring engine for rankings.
- Keep the UI simple and responsive; enable a later migration to an SPA or API-first frontend if needed.

Assumptions
- Primary consumers: internal university staff (Admins and Department Reps), optional External Reviewers, and public viewers.
- Data currently exists in the repository / Turso; migration scripts will be needed to transform and import existing records.
- PostgreSQL is recommended for production; SQLite can be used for local development.

Actors (Who uses the system)
- Super Admin
  - Full system management: create ranking cycles, manage metrics, publish final rankings, manage users, view audit logs.
- Department Representative (Dept Rep)
  - Fill out assigned ranking questions, upload supporting evidence, save drafts, submit answers for review, respond to reviewer/admin comments.
- External Reviewer (optional)
  - Review submitted answers, leave comments, request revisions or make decisions (subject to role permissions defined by Admin).
- Public Viewer
  - View published rankings and public reports; no authentication required.

Core actions (What each actor does)
- Super Admin
  - Create and manage ranking cycles (template clone), assign tasks/questions to departments, review & approve submissions, compute and publish rankings.
- Department Rep
  - Complete and save drafts of assigned questions, submit finalized answers with attachments, view submission status and review comments.
- External Reviewer
  - Inspect submissions assigned for review, leave comments, and recommend approval or rejection.
- Public Viewer
  - Browse published rankings, filter by year and category, and export reports.

Data model (primary entities)
- User: id, full_name, email, password_hash, role, department_id (nullable), created_at, last_login
- Institution (optional): id, name, metadata
- Department: id, name, institution_id, contact_info
- RankingCycle: id, name, year, is_template (bool), status, deadline, created_by, created_at
- Question: id, ranking_cycle_id, code, title, description, question_type, is_synced (bool), kpi_index, max_words, options (JSON)
- QuestionItem: id, question_id, item_index, label, answer_type
- Assignment (TaskAssignment): id, question_id, department_id, assignee_user_id, status (draft/submitted/under_review/approved/rejected), assigned_at, submitted_at, deadline
- Answer: id, assignment_id, answer_text, answer_number, metadata (JSON), attachments (references), status, updated_at
- AnswerHistory (Audit): id, answer_id, assignment_id, old_value, new_value, changed_by, changed_at, reason
- Review: id, assignment_id, reviewer_id, comment, decision, created_at
- Metric & Criterion: defines scoring structure; used by scoring engine
- Score / Ranking cache: precomputed ranking results per cycle/year
- ReminderLog, Attachment, AuditLog: operational tables

Workflows & rules
- Draft -> Submitted -> Under Review -> Approved/Rejected -> Published
- Only Admins can publish final rankings (publish action moves cycle to "published" and locks editing)
- If a question is tagged is_synced=true, an accepted answer should propagate to matching questions across other cycles for that department (backend enforces this)
- Attachments must be scanned (virus-scan) and stored securely (S3/MinIO or protected file store)
- All changes (create, update, status changes) must be logged in AnswerHistory and AuditLog
- Deadline enforcement and reminder campaigns (automated/manual) supported by ReminderLog

Scoring & metrics
- A scoring engine computes per-department scores for a cycle based on defined Metrics and Criteria with weights
- Formula: Weighted average across criteria; support for normalization, caps, and custom formulas per metric
- Scoring must be deterministic and versioned (store formula version + inputs used for traceability)

API surface (core endpoints — FastAPI conventions)
- Auth
  - POST /api/auth/login -> returns JWT or sets secure session cookie
  - POST /api/auth/logout
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password
  - GET /api/auth/me
- Users (Admin)
  - GET /api/users
  - POST /api/users
  - GET /api/users/{user_id}
  - PATCH /api/users/{user_id}
  - DELETE /api/users/{user_id}
- Departments & Institutions
  - GET /api/departments
  - GET /api/departments/{id}
  - POST /api/departments (admin)
  - PATCH /api/departments/{id}
- Ranking cycles & questions
  - GET /api/cycles
  - POST /api/cycles (admin) — supports is_template flag and cloning templates
  - GET /api/cycles/{id}/questions
  - POST /api/cycles/{id}/assign -> create TaskAssignment(s)
- Assignments & answers
  - GET /api/assignments?department_id=&cycle_id=&status=
  - GET /api/assignments/{id}
  - POST /api/assignments/{id}/answers -> save draft or submit
  - POST /api/assignments/{id}/submit -> transition to submitted (logs timestamp)
  - POST /api/assignments/{id}/review -> review comment/decision
  - POST /api/assignments/{id}/rescind -> admin re-open (if permitted)
- Metrics & scoring
  - GET /api/metrics
  - POST /api/rankings/compute?cycle_id= (admin)
  - GET /api/rankings?year=&cycle_id=
- Admin utilities
  - GET /api/audit/logs
  - POST /api/reminders -> trigger reminder campaign and log it

Frontend pages (server-rendered templates + progressive enhancement)
- Public
  - / -> landing + latest published rankings
  - /rankings/{year} -> ranking detail and filters
- Auth
  - /login, /forgot-password, /reset-password
- Dept Rep (dashboard)
  - /dashboard -> assigned cycles + progress
  - /cycles/{id}/questions -> multi-step submission UI
  - /assignments/{id} -> edit/draft/submit, add attachments
  - /assignments/{id}/history -> view AnswerHistory and reviews
- Reviewer UI
  - /reviews -> queue of pending submissions
  - /reviews/{assignment_id} -> review form and comment history
- Admin UI
  - /admin -> system overview
  - /admin/cycles -> create/clone/close cycles
  - /admin/metrics -> manage scoring definitions
  - /admin/users -> user management
  - /admin/audit -> audit logs and export

UI/UX principles
- Forms with autosave and visible save states
- Clear inline validation and server-side validation fallback
- Accessible semantic HTML, responsive layout, keyboard navigable
- Minimal JavaScript approach (vanilla or small libs like Alpine.js); consider Tailwind CSS for rapid styling

Security & privacy
- Passwords hashed with Argon2 or bcrypt
- HTTPS required in production; use secure, httpOnly cookies for session tokens or standard JWT with refresh tokens
- Role-based access control enforced server-side for every endpoint
- CSRF protection for forms (cookies) and CORS configured for API usage
- File uploads scanned and stored in private storage; served via signed or authenticated URLs
- Rate-limiting on auth endpoints and sensitive actions

Data migration
- Provide import scripts to map existing Turso/SQLite tables to new schema (one-time scripts with idempotence)
- Import procedure: export from old DB -> transform JSON -> import into new DB -> verify counts and sample records -> mark imported cycles in metadata

Testing
- Unit tests: scoring functions, permission checks, date/deadline logic
- API tests: use pytest + httpx + pytest-asyncio to exercise endpoints and permission boundaries
- Integration tests: end-to-end flows for Dept Rep and Admin (create -> submit -> review -> publish)
- Linting/formatting: black, isort, flake8

Developer workflow & tooling
- Local dev: Docker Compose with web (uvicorn), db (postgres), redis (optional)
- Run server: uvicorn app.main:app --reload
- Migrations: Alembic for SQLAlchemy
- Background tasks: RQ or Celery + Redis (optional)
- CI: GitHub Actions to run tests and linters

Deployment
- Containerize with Docker; use managed Postgres in production
- Recommended hosts: Render, Fly.io, DigitalOcean App Platform, or AWS (ECS/Fargate)
- Use S3 or compatible object storage for attachments
- Configure monitoring (Sentry) and periodic DB backups

Project milestones (MVP-focused)
1. Project scaffold, DB schema, Alembic, basic Auth (2–4 days)
2. Department and assignment models + submission CRUD + draft autosave (4–6 days)
3. Review workflow, admin UI for cycles & assignments (4–6 days)
4. Scoring engine & ranking compute + caching (3–5 days)
5. File uploads, reminders, audit logs, tests, and deployment (4–7 days)

Concrete tasks (todo-style)
- repo-setup: scaffold project, add README, .gitignore, GitHub Actions
- db-setup: create models, configure SQLAlchemy + Alembic
- auth: implement JWT-based auth and session handling
- assignments: implement assignment/answer endpoints, autosave, and propagation for is_synced
- review-flow: implement review endpoints, UI and audit logging
- scoring: implement metrics/criteria and scoring module with unit tests
- migration-scripts: write import scripts for old DB
- deploy: dockerize and deploy to staging

File comments & documentation
- Add concise file header comments to each module, explaining its purpose, main classes/functions provided, and high-level behavior (e.g., auth.py: "handles password hashing, token creation and user session endpoints").
- Document the scoring algorithm and provide example inputs and expected outputs in tests.

Next steps
- Confirm whether to replace the existing README or add this as a new README file. This draft is saved as `README_REBUILD.md` in the repository root so the existing README is preserved.
- If desired, replace the main `README.md` with this content, or merge selected sections into the existing README.
- Optionally, scaffold the FastAPI project now (models + auth + migrations) — request which task to start.

Contact & support
- For implementation help, indicate whether to scaffold the project, implement auth and DB migrations first, or generate the scoring engine module and unit tests.

---

Generated by: AI assistant using Copilot CLI runtime in VS Code
