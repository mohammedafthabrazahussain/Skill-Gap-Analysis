const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import routes
const auth = require('./routes/auth');
const skills = require('./routes/skills');
const roles = require('./routes/roles');
const analysis = require('./routes/analysis');
const resume = require('./routes/resume');
const tasks = require('./routes/tasks');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/skills', skills);
app.use('/api/v1/roles', roles);
app.use('/api/v1/analysis', analysis);
app.use('/api/v1/resume', resume);
app.use('/api/v1/tasks', tasks);

// Root route (optional but useful)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Connect to MongoDB (NO app.listen)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(`Mongo Error: ${err.message}`));

// Export app for Vercel
module.exports = app;