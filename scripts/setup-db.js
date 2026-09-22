const db = require('./db');

async function setup() {
  console.log('Setting up database tables...');

  await db.executeMultiple(`

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      department_id INTEGER REFERENCES departments(id),
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'department_user')),
      created_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      token TEXT,
      last_login DATETIME,
      created_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ranking_cycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      year INTEGER NOT NULL,
      deadline DATETIME,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'closed', 'draft')),
      created_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ranking_cycle_id INTEGER NOT NULL REFERENCES ranking_cycles(id),
      code TEXT,
      title TEXT NOT NULL,
      description TEXT,
      question_type TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS question_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL REFERENCES questions(id),
      item_number TEXT NOT NULL,
      label TEXT NOT NULL,
      answer_type TEXT NOT NULL CHECK(answer_type IN ('text','url','number','checkbox','yesno')),
      max_words INTEGER
    );

    CREATE TABLE IF NOT EXISTS task_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL REFERENCES questions(id),
      department_id INTEGER NOT NULL REFERENCES departments(id),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','submitted','accepted','rejected','queried')),
      assigned_at DATETIME DEFAULT (datetime('now')),
      submitted_at DATETIME,
      UNIQUE(question_id)
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_assignment_id INTEGER NOT NULL REFERENCES task_assignments(id),
      answer_text TEXT,
      answer_number REAL,
      file_path TEXT,
      updated_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS answer_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      answer_id INTEGER NOT NULL REFERENCES answers(id),
      task_assignment_id INTEGER NOT NULL REFERENCES task_assignments(id),
      answer_text TEXT,
      answer_number REAL,
      changed_at DATETIME DEFAULT (datetime('now')),
      changed_by INTEGER REFERENCES users(id)
    );

  `);

  console.log('All tables created successfully!');
  process.exit(0);
}

setup().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});