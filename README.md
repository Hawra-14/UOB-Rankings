# 🎓 UoB Rankings Tracker

A centralized, full-stack institutional data collection portal designed for the University of Bahrain. The system streamlines the submission, tracking, and approval of data required for global university rankings, including **QS World University Rankings**, **QS Sustainability**, **THE World University Rankings**, **THE Impact**, and **UI GreenMetric**.

---

## 👥 User Roles & Capabilities

The system is designed around two primary user roles, each with distinct capabilities:

### 1. Administrator
- **Cycle Management**: Create new ranking cycles (e.g., "QS WUR 2026"). The system automatically clones questions from predefined templates.
- **Task Assignment**: Assign specific questions to specific departments with custom deadlines. Supports "synced" questions that automatically propagate across multiple ranking forms.
- **Monitoring**: View real-time dashboards of department progress, pending tasks, and overdue submissions.
- **Communication**: Send targeted email reminders (via EmailJS) to specific departments or users who are lagging behind.
- **Review & Audit**: Review submitted answers, add administrative comments, and change submission statuses (Accept, Reject, Query). View full audit trails of who changed what and when.
- **User Management**: Create departments and add department users with secure credentials.

### 2. Department User
- **Dashboard Overview**: View a personalized dashboard showing total questions, completion rates, and upcoming deadlines.
- **Dynamic Form Filling**: Access assigned ranking forms featuring dynamic input types (rich text, URLs, numbers, checkboxes, calculated grids).
- **Draft & Submit**: Save progress as drafts. Submit finalized answers, which are instantly logged in the audit history.
- **Progress Tracking**: View visual progress indicators (donut charts, progress bars) for all assigned ranking cycles.

---

## 🔄 Project Workflow (Step-by-Step)

1. **Setup**: An Administrator creates a new Ranking Cycle (e.g., "THE Impact 2026"). The backend automatically clones the base questions from a master template cycle.
2. **Assignment**: The Admin navig to the cycle, selects questions, and assigns them to relevant departments (e.g., assigning "SDG 4: Quality Education" questions to the "Deanship of Student Affairs").
3. **Notification**: The system tracks deadlines. If a department is approaching a deadline with pending tasks, the Admin can use the **Reminders** module to send automated, templated emails via EmailJS.
4. **Submission**: The Department User logs in, navigates to "My Ranking Forms", fills out the dynamic fields, and clicks "Submit". 
5. **Syncing (Optional)**: If a question is marked `is_synced = 1` (e.g., total faculty count), the backend automatically propagates this answer to the same question in other active ranking cycles for that department.
6. **Review**: The Admin reviews the submission in the Admin Form view. They can accept it, or reject it with an `admin_comment`, which prompts the department to revise and resubmit.
7. **Audit**: Every change is recorded in the `answer_history` table, capturing the old value, new value, timestamp, and the user who made the change.

---

## 🗄️ Database Schema Deep Dive (Turso / SQLite)

The database is highly normalized to ensure data integrity and support complex ranking logic.

| Table | Purpose & Key Columns |
| :--- | :--- |
| **`departments`** | Stores university departments. (`id`, `name`, `created_at`) |
| **`users`** | System users linked to departments. Includes password reset fields. (`id`, `name`, `email`, `department_id`, `password_hash`, `role`, `reset_token`, `reset_otp`) |
| **`ranking_cycles`** | Defines active campaigns. Templates have `is_template = 1`. (`id`, `name`, `year`, `deadline`, `status`, `is_template`) |
| **`questions`** | The actual ranking indicators. Linked to a cycle. (`id`, `ranking_cycle_id`, `code`, `title`, `question_type`, `theme`, `kpi_index`, `is_synced`, `gm_category`) |
| **`question_items`** | Sub-fields for complex questions (e.g., a grid with "Full Time", "Part Time"). (`id`, `question_id`, `item_number`, `label`, `answer_type`, `max_words`, `options`) |
| **`task_assignments`** | Maps a specific question to a specific department for a cycle. (`id`, `question_id`, `department_id`, `status`, `assigned_at`, `submitted_at`, `deadline`) |
| **`answers`** | Stores the actual submitted data for a task. (`id`, `task_assignment_id`, `answer_text`, `answer_number`, `status`, `admin_comment`) |
| **`answer_history`** | **Audit Trail**. Records every change made to an answer. (`id`, `answer_id`, `task_assignment_id`, `answer_text`, `answer_number`, `changed_at`, `changed_by`) |
| **`reminder_history`** | Logs all automated or manual email reminders sent to departments. (`id`, `ranking_cycle_id`, `department_id`, `reminder_type`, `sent_at`, `message_sent`) |
| **`user_credentials`** | (Optional) Tracks active session tokens and last login times. |

---

## 🔌 API Endpoints Reference

### `/api/auth`
- `POST /login` - Authenticate user, return JWT and user profile.
- `POST /logout` - Invalidate session.
- `POST /forgot-password` - Generate OTP, save to DB, and trigger EmailJS reset link.
- `POST /reset-password` - Verify OTP/token and update `password_hash`.

### `/api/admin` *(Protected: Admin Only)*
- `GET /dashboard` - Fetch global stats (total, submitted, pending tasks).
- `GET /cycles` & `POST /cycles` - List cycles or create a new one (auto-clones template questions).
- `GET /cycles/:id/questions` - Fetch all questions for a cycle with their assignment and answer status.
- `POST /assign` - Assign a question to a department. *Smart logic: automatically finds and assigns sibling questions (same `kpi_index`) and synced questions (`is_synced=1`).*
- `GET /departments` & `POST /add-department` - Manage departments.
- `GET /users` - List all users with their department names.
- `PATCH /cycles/:id/close` - Lock a cycle, preventing further submissions.

### `/api/questions`
- `GET /my-rankings` - Fetch all ranking cycles assigned to the logged-in user's department, with completion stats.
- `GET /my-questions/:ranking_cycle_id` - Fetch the specific questions, sub-items, and current draft answers for the user's department.

### `/api/submissions`
- `POST /submit` - Save or update an answer. *Smart logic: Updates `answers`, logs to `answer_history`, and if `is_synced=1`, propagates the answer to matching questions in other cycles.*
- `GET /history-all/:taskId` - Fetch the complete audit trail of a specific question across all years/cycles.

### `/api/admin/reminders` *(Protected: Admin Only)*
- `GET /needs-attention` - Optimized query returning departments with overdue or pending tasks, sorted by urgency.
- `GET /history` - Fetch grouped logs of previously sent reminders.
- `POST /log` - Record a new reminder campaign in the database after EmailJS successfully sends.

---

## 🏗️ Architecture & Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** Turso (Edge SQLite) via `@libsql/client`
- **Authentication:** JWT (JSON Web Tokens) with `bcrypt` for password hashing
- **Email Services:** EmailJS Node SDK (Password resets, deadline reminders)

### Frontend (Current State → Target State)
- **Current:** Vanilla HTML5, CSS3, JavaScript (ES6+), Quill.js for rich text.
- **Target (In Progress):** Consolidated Single Page Application (SPA) architecture reducing 15+ HTML files to 3 core files (`index.html`, `admin.html`, `app.html`) with a unified `styles.css` and Vanilla JS router.

### Hosting & CI/CD
- **Application Hosting:** Render.com (serves both Express API and static frontend assets)
- **Database Hosting:** Turso Cloud
- **Version Control:** GitHub
- **CI/CD:** GitHub Actions (Automated linting, testing, and Render deployment via webhooks)

---

## 🚀 Getting Started & Deployment

### 1. Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd uob-rankings-v2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your TURSO_URL, TURSO_TOKEN, and JWT_SECRET

# Initialize database (if needed)
node setup-db.js
node seed-qs-wur.js # Example seeding script

# Start the server
node server.js