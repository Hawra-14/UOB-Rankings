const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Catch unhandled errors to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, images) from the root directory
// ⚠️ IMPORTANT: If you moved your HTML files into a 'public' folder, 
// change '__dirname' to 'path.join(__dirname, "public")' below.
app.use(express.static(__dirname, { extensions: ['html'] }));

// API Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/admin/reminders', require('./routes/reminder'));
app.use('/api/health', require('./routes/health')); // Health check endpoint

// Error Handling (Must be at the very end)
const { notFoundHandler, serverErrorHandler } = require('./errorHandling');
app.use(notFoundHandler);
app.use(serverErrorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});