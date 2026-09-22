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
const path = require('path');
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// API Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/admin/reminders', require('./routes/reminder')); // This one is crucial!


// Error Handling (Must be last)
app.use(notFoundHandler);
app.use(serverErrorHandler);

// Health Check Route
app.use('/api/health', require('./routes/health'));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('Waiting for requests... (If the terminal prompt returns, check the red error logs above!)');
});