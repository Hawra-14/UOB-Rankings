const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Catch crashes so we can see the real error
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve HTML/CSS/JS/images from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes (routes folder is in root)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/admin/reminders', require('./routes/reminder'));
app.use('/api/activity', require('./routes/activity')); // Audit log
app.use('/api/health', require('./routes/health'));     // Health check
app.use('/api/activity', require('./routes/activity'));

// Error handling (MUST be last)
const { notFoundHandler, serverErrorHandler } = require('./src/errorHandling');
app.use(notFoundHandler);
app.use(serverErrorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});