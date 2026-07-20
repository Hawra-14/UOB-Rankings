const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ADD THESE TO CATCH CRASHES AND PRINT THE ERROR 🚨
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION - The server is crashing because of this:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION - The server is crashing because of this:', err);
});

// Import custom modules
const { notFoundHandler, serverErrorHandler } = require('./errorHandling'); 
const reminderRoutes = require('./routes/reminder');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname, { extensions: ['html'] }));

// API Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/submissions', require('./routes/submissions'));

// New Reminder Route
app.use('/api/admin/reminders', reminderRoutes);

// Error Handling (Must be last)
app.use(notFoundHandler);
app.use(serverErrorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('Waiting for requests... (If the terminal prompt returns, check the red error logs above!)');
});