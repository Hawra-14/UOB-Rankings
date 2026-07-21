# 🎓 UoB Rankings Tracker

A centralized, full-stack institutional data collection portal designed for the University of Bahrain. The system streamlines the submission, tracking, and approval of data required for global university rankings, including **QS World University Rankings**, **QS Sustainability**, **THE World University Rankings**, **THE Impact**, and **UI GreenMetric**.

## 🏗️ Architecture & Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** Turso (Edge SQLite)
- **Authentication:** JWT (JSON Web Tokens) with bcrypt for password hashing
- **Email Services:** EmailJS (Password resets, deadline reminders)

### Frontend
- **Core:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **UI Components:** Custom CSS variables, responsive grid layouts, and dynamic DOM manipulation.
- **Rich Text:** Quill.js (for essay/evidence-based questions)

### Hosting & CI/CD
- **Backend & Full-Stack Hosting:** Render.com
- **Version Control:** GitHub
- **CI/CD:** GitHub Actions (Automated testing and deployment pipelines)

---

## 🗄️ Database Schema Overview

The application utilizes a normalized relational database structure managed via Turso:

| Table | Purpose |
| :--- | :--- |
| `departments` | University departments (e.g., IT, HR, Finance). |
| `users` | System users linked to departments with role-based access (`admin`, `department_user`). |
| `ranking_cycles` | Defines the active ranking campaigns (e.g., "QS WUR 2026") with deadlines. |
| `questions` | The actual ranking indicators/metrics mapped to specific cycles. |
| `question_items` | Sub-fields for complex questions (e.g., grids, multiple URLs). |
| `task_assignments` | Maps questions to specific departments with tracking statuses. |
| `answers` | Stores the submitted data (text, numbers, files) for each task. |
| `answer_history` | Audit trail for all answer modifications. |
| `reminder_history` | Logs automated or manual email reminders sent to departments. |

---

## 🔌 API Endpoints Summary

### `/api/auth`
- `POST /login` - Authenticate user and issue JWT.
- `POST /logout` - Invalidate session.
- `POST /forgot-password` - Generate OTP and send reset email.
- `POST /reset-password` - Verify OTP and update password.

### `/api/admin`
- `GET /cycles` - Fetch all ranking cycles.
- `POST /cycles` - Create a new ranking cycle.
- `GET /departments` / `POST /add-department` - Manage departments.
- `GET /users` / `POST /add-user` - Manage system users.

### `/api/questions`
- `GET /my-rankings` - Fetch assigned ranking cycles for the logged-in department.
- `GET /my-questions/:cycleId` - Fetch specific questions and current submission status.

### `/api/submissions`
- `POST /submit` - Save or update an answer for a specific task assignment.
- `GET /history-all/:taskId` - Fetch the audit history of a specific question.

### `/api/admin/reminders`
- `GET /needs-attention` - Fetch departments with overdue/pending tasks.
- `POST /log` - Log a reminder campaign.
- `GET /history` - Fetch past reminder logs.

---
