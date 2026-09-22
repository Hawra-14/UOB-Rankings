const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('Seeding database...');

  // 1. Departments
  await db.executeMultiple(`
    INSERT OR IGNORE INTO departments (id, name) VALUES (1, 'Research & Graduate Studies');
    INSERT OR IGNORE INTO departments (id, name) VALUES (2, 'Human Resources');
    INSERT OR IGNORE INTO departments (id, name) VALUES (3, 'IT & Digital Services');
    INSERT OR IGNORE INTO departments (id, name) VALUES (4, 'Sustainability Office');
    INSERT OR IGNORE INTO departments (id, name) VALUES (5, 'Quality Assurance');
    INSERT OR IGNORE INTO departments (id, name) VALUES (6, 'Finance & Accounts');
    INSERT OR IGNORE INTO departments (id, name) VALUES (7, 'College of Science');
    INSERT OR IGNORE INTO departments (id, name) VALUES (8, 'Sustainability Office');
    INSERT OR IGNORE INTO departments (id, name) VALUES (9, 'Deanship of Student Affairs');
    INSERT OR IGNORE INTO departments (id, name) VALUES (10, 'Deanship of Graduate Studies');
    INSERT OR IGNORE INTO departments (id, name) VALUES (11, 'Deanship of Student Affairs');
    INSERT OR IGNORE INTO departments (id, name) VALUES (12, 'Deanship of Graduate Studies');
    INSERT OR IGNORE INTO departments (id, name) VALUES (13, 'Deanship of Admissions');
  `);
  console.log('Departments created!');

  // 2. Ranking cycles
  await db.executeMultiple(`
    INSERT OR IGNORE INTO ranking_cycles (id, name, year, deadline, status) VALUES (1, 'QS Sustainability Rankings', 2025, '2025-06-15', 'active');
    INSERT OR IGNORE INTO ranking_cycles (id, name, year, deadline, status) VALUES (2, 'QS World University Rankings', 2025, '2025-03-31', 'active');
    INSERT OR IGNORE INTO ranking_cycles (id, name, year, deadline, status) VALUES (3, 'Times Higher Education World Rankings', 2025, '2025-04-30', 'active');
    INSERT OR IGNORE INTO ranking_cycles (id, name, year, deadline, status) VALUES (4, 'THE Impact Rankings', 2025, '2025-05-15', 'active');
    INSERT OR IGNORE INTO ranking_cycles (id, name, year, deadline, status) VALUES (5, 'Green Metric Rankings', 2025, '2025-05-30', 'active');
  `);
  console.log('Ranking cycles created!');

  // 3. Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await db.execute({
    sql: `INSERT OR IGNORE INTO users (id, name, email, password_hash, role)
          VALUES (1, 'System Administrator', 'admin@uob.bh', ?, 'admin')`,
    args: [adminPassword]
  });
  console.log('Admin created!');

  // 4. Department users (matching your database screenshot)
  const deptPassword = await bcrypt.hash('dept123', 10);
  const deptUsers = [
    [2, 'IT Department', 'it@uob.bh', 3],
    [3, 'Human Resources', 'hr@uob.bh', 2],
    [4, 'Sustainability Office', 'sustainability@uob.bh', 8],
    [5, 'Quality Assurance', 'qa@uob.bh', 5],
    [6, 'Registrar Office', 'registrar@uob.bh', 4],
    [7, 'Finance & Accounts', 'finance@uob.bh', 6],
    [8, 'Research & Graduate Studies', 'research@uob.bh', 1],
    [9, 'Deanship of Student Affairs', 'studentaffairs@uob.bh', 9],
    [10, 'Deanship of Graduate Studies', 'gradstudies@uob.bh', 10],
    [11, 'Deanship of Admissions', 'admissions@uob.bh', 11],
    [12, 'College of Science', 'science@uob.bh', 7],
  ];

  for (const [id, name, email, dept_id] of deptUsers) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO users (id, name, email, password_hash, role, department_id)
            VALUES (?, ?, ?, ?, 'department_user', ?)`,
      args: [id, name, email, deptPassword, dept_id]
    });
  }
  console.log('Department users created!');

  console.log('');
  console.log('Done! Login credentials:');
  console.log('Admin        → admin@uob.bh / admin123');
  console.log('IT Dept      → it@uob.bh / dept123');
  console.log('Sustainability → sustainability@uob.bh / dept123');
  console.log('(all dept users use password: dept123)');

  process.exit(0);
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});